import {MethodName} from "./api";

export interface ApiTest {
    endpointTests: EndpointTest[]
}

export interface EndpointTest {
    name: string
    httpMethodTests: HttpMethodTest[]
}

export interface HttpMethodTest {
    methodName: MethodName
    responseCode: number
    responseObject: any
    propertyTests: PropertyTest[]
}

export interface PropertyTest {
    name: string
    isWriteAble: boolean
}
