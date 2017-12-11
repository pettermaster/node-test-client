
export interface Api {
    rootPath: string
    endpoints: Endpoint[]
}

export interface Endpoint {
    relativePath: string
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
