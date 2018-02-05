import fetch from 'node-fetch'

import { Api, Endpoint, HttpMethod, MethodName } from './entities/api'
import { ApiTest, EndpointTest, HttpMethodTest, PropertyTest } from './entities/test'
const api = require('./api.json') as Api
const USER_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhMWQ1MGZlZTIyMGJhMmY3YWI1OTUzNCIsInVzZXJuYW1lIjoicGV0dGVyIiwicGFzc3dvcmQiOiJwZXR0ZXIiLCJfX3YiOjAsImNoYXRzIjpbXSwicm9sZSI6IlVTRVIifSwicm9sZSI6IlVTRVIiLCJpYXQiOjE1MTc4MjMyMTcsImV4cCI6MTUxODY4NzIxN30.tXC-eSxF71kPlmujAektMomvu6JGvg3juVdRoZ1zoD0'

const get = async (url: string, methodName: MethodName): Promise<HttpMethodTest> => {
    const response = await fetch(
        url,
        {
            method: 'get',
            headers: {
                'Authorization': USER_ACCESS_TOKEN
            }
        }
    )
    const json = await response.json()
    if (response.ok) {
        return {
            methodName: methodName,
            responseCode: response.status,
            responseObject: json,
            propertyTests: []
        }
    } else {
        return {
            methodName: methodName,
            responseCode: response.status,
            responseObject: null,
            propertyTests: [],
            detailedError: json.message
        }
    }

}

const compareResults = (requestData, responseData): PropertyTest[] => {

    const propertyTests: PropertyTest[] = []

    for (let key in responseData) {
        propertyTests.push({
            name: key,
            isWriteAble: requestData[key] === responseData[key]
        })
    }

    return propertyTests
}

const post = async (url: string, sample: any, methodName: MethodName): Promise<HttpMethodTest> => {
    const response = await fetch(
        url,
        {
            method: 'post',
            body: sample,
            headers: {
                'Authorization': USER_ACCESS_TOKEN
            }
        }
    )
    const json = await response.json()
    if (response.ok) {

        return {
            methodName: methodName,
            responseCode: response.status,
            responseObject: json,
            propertyTests: compareResults(sample, json)
        }
    } else {
        return {
            methodName: methodName,
            responseCode: response.status,
            responseObject: undefined,
            propertyTests: [],
            detailedError: json.message
        }
    }
}

const createHttpMethodTest = async (httpMethod: HttpMethod, relativePath: string): Promise<HttpMethodTest> => {
    const fullPath = `${api.rootPath}/${relativePath}`
    const sample = httpMethod.sample
    switch (httpMethod.methodName) {
    case MethodName.GET:
        return get(fullPath, httpMethod.methodName)

    case MethodName.POST:
        return post(fullPath, sample, httpMethod.methodName)

    default:
        throw Error(`Method ${httpMethod.methodName} not supported`)
    }
}

const createEndpointTest = async (endpoint: Endpoint): Promise<EndpointTest> => {
    const httpMethodTests = await Promise.all(endpoint.httpMethods.map(httpMethod => createHttpMethodTest(httpMethod, endpoint.relativePath)))
    return {
        name: endpoint.relativePath,
        httpMethodTests: httpMethodTests
    }
}

const testApi = async (api: Api): Promise<ApiTest> => {
    const endpointTests = await Promise.all(api.endpoints.map(createEndpointTest))
    return {
        endpointTests: endpointTests
    }
}

const isSuccessHttpCode = (httpCode: number): boolean => {
    return httpCode >= 200 && httpCode < 300
}

const logHttpMethodTest = (httpMethodTest: HttpMethodTest) => {
    console.log(`  ${httpMethodTest.methodName}`)
    const isGetMethod = httpMethodTest.methodName === MethodName.GET
    if (isGetMethod) {
        console.log(`    ${isSuccessHttpCode(httpMethodTest.responseCode) ? `accessible` : `not accessible (${httpMethodTest.detailedError})`}`)
    } else {
        httpMethodTest.propertyTests.forEach(propertyTest => {
            console.log(`    Key ${propertyTest.name} is ${propertyTest.isWriteAble ? `writeable` : `NOT writeable`}`)
        })
    }
}

const logEndpointTest = (endpointTest: EndpointTest) => {
    console.log(endpointTest.name)
    endpointTest.httpMethodTests.forEach(logHttpMethodTest)
}

const executeTest = async () => {
    const apiTest: ApiTest = await testApi(api)
    apiTest.endpointTests.forEach(logEndpointTest)
}

executeTest()
