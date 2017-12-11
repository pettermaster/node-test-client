"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const api_1 = require("./entities/api");
const api = require('./api.json');
const USER_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhMWQ1MGZlZTIyMGJhMmY3YWI1OTUzNCIsInVzZXJuYW1lIjoicGV0dGVyIiwicGFzc3dvcmQiOiJwZXR0ZXIiLCJfX3YiOjAsImNoYXRzIjpbXSwicm9sZSI6IlVTRVIifSwicm9sZSI6IlVTRVIiLCJpYXQiOjE1MTE4NzA3MzAsImV4cCI6MTUxMjczNDczMH0.-_nFv57h-IagPVwCtsDmG0N-PkgMkiaAj2k4sYhVpLo';
const arrayRegex = /\[.*]/;
const isArrayEndpoint = (entity) => {
    return entity.match(arrayRegex) !== null;
};
const get = (url, methodName) => __awaiter(this, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(url, {
        method: 'get',
        headers: {
            'Authorization': ''
        }
    });
    if (response.ok) {
        const json = yield response.json();
        const httpMethodTest = {
            methodName: methodName,
            responseCode: response.status,
            responseObject: json,
            propertyTests: []
        };
        return httpMethodTest;
    }
    else {
        const httpMethodTest = {
            methodName: methodName,
            responseCode: response.status,
            responseObject: null,
            propertyTests: []
        };
    }
});
const compareResults = (requestData, responseData) => {
    const propertyTests = [];
    for (let key in responseData) {
        if (typeof requestData[key] !== 'undefined') {
            propertyTests.push({
                name: key,
                isWriteAble: requestData[key] === responseData[key]
            });
        }
        else {
            console.log(`property ${key} not tested`);
        }
    }
    return propertyTests;
};
const post = (url, sample, methodName) => __awaiter(this, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(url, {
        method: 'post',
        body: sample,
        headers: {
            'Authorization': USER_ACCESS_TOKEN
        }
    });
    if (response.ok) {
        const json = yield response.json();
        const httpMethodTest = {
            methodName: methodName,
            responseCode: response.status,
            responseObject: compareResults(sample, json),
            propertyTests: []
        };
        return httpMethodTest;
    }
    else {
        console.log(response.status);
    }
});
const createHttpMethodTest = (httpMethod, relativePath) => __awaiter(this, void 0, void 0, function* () {
    const fullPath = `${api.rootPath}/${relativePath}`;
    const sample = httpMethod.sample;
    switch (httpMethod.methodName) {
        case api_1.MethodName.GET:
            return get(fullPath, httpMethod.methodName);
        case api_1.MethodName.POST:
            return post(fullPath, sample);
    }
    // fall through case
    return {
        methodName: httpMethod.methodName,
        responseCode: 0,
        responseObject: null,
        propertyTests: []
    };
});
const createEndpointTest = (endpoint) => __awaiter(this, void 0, void 0, function* () {
    const httpMethodTests = yield endpoint.httpMethods.map(createHttpMethodTest);
    const endpointTest = {
        name: endpoint.relativePath,
        httpMethodTests: httpMethodTests
    };
    return endpointTest;
});
const testApi = (api) => __awaiter(this, void 0, void 0, function* () {
    const endpointTests = api.endpoints.map(createEndpointTest);
    const apiTest = {
        endpointTests: endpointTests
    };
    return apiTest;
});
const apiTest = testApi(api);
apiTest.endpointTests.forEach(it => {
    console.log(it);
    it.httpMethodTests;
});
console.log(apiTest);
