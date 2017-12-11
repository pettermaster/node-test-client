import fetch from 'node-fetch'

import { Api, Endpoint, HttpMethod, MethodName } from './entities/api'
import { ApiTest, EndpointTest, HttpMethodTest, PropertyTest } from './entities/test'
const api = require('./api.json') as Api
const USER_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhMWQ1MGZlZTIyMGJhMmY3YWI1OTUzNCIsInVzZXJuYW1lIjoicGV0dGVyIiwicGFzc3dvcmQiOiJwZXR0ZXIiLCJfX3YiOjAsImNoYXRzIjpbXSwicm9sZSI6IlVTRVIifSwicm9sZSI6IlVTRVIiLCJpYXQiOjE1MTE4NzA3MzAsImV4cCI6MTUxMjczNDczMH0.-_nFv57h-IagPVwCtsDmG0N-PkgMkiaAj2k4sYhVpLo'

const arrayRegex = /\[.*]/

const isArrayEndpoint = (entity) => {
    return entity.match(arrayRegex) !== null
}

const get = async (url: string, methodName: MethodName): Promise<HttpMethodTest> => {
    const response = await fetch(
        url,
        {
            method: 'get',
            headers: {
                'Authorization': ''
            }
        }
    )
    if (response.ok) {
        const json = await response.json()
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
            propertyTests: []
        }
    }

}

const compareResults = (requestData, responseData): PropertyTest[] => {

    const propertyTests: PropertyTest[] = []

    for (let key in responseData) {
        if (typeof requestData[key] !== 'undefined') {
            propertyTests.push({
                name: key,
                isWriteAble: requestData[key] === responseData[key]
            })
        } else {
            console.log(`property ${key} not tested`)
        }
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
    if (response.ok) {
        const json = await response.json()

        const httpMethodTest: HttpMethodTest = {
            methodName: methodName,
            responseCode: response.status,
            responseObject: compareResults(sample,json),
            propertyTests: []
        }
        return httpMethodTest
    } else {
        console.log(response.status)
    }
}

const createHttpMethodTest = async (httpMethod: HttpMethod, relativePath): Promise<HttpMethodTest> => {
    const fullPath = `${api.rootPath}/${relativePath}`
    const sample = httpMethod.sample
    switch (httpMethod.methodName) {
    case MethodName.GET:
        return get(fullPath, httpMethod.methodName)

    case MethodName.POST:
        return post(fullPath, sample)
    }
    // fall through case
    return {
        methodName: httpMethod.methodName,
        responseCode: 0,
        responseObject: null,
        propertyTests: []
    }
}

const createEndpointTest = async (endpoint: Endpoint): Promise<EndpointTest> => {
    const httpMethodTests = await endpoint.httpMethods.map(createHttpMethodTest)
    const endpointTest: EndpointTest = {
        name: endpoint.relativePath,
        httpMethodTests : httpMethodTests
    }
    return endpointTest
}

const testApi = async (api: Api): ApiTest => {
    const endpointTests = api.endpoints.map(createEndpointTest)
    const apiTest: ApiTest = {
        endpointTests: endpointTests
    }
    return apiTest
}

const apiTest: ApiTest = testApi(api)
console.log(apiTest)
