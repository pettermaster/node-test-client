
export interface Api {
    rootPath: String
    endpoints: Endpoint[]
}

export interface Endpoint {
    relativePath: String
    httpMethods: HttpMethod[]
}

export interface HttpMethod {
    methodName: MethodName
    sample: any
}

export enum MethodName {
    GET = 'GET',
    POST = 'POST'
}
