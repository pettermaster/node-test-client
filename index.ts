import api from './api.json'
import * as fetch from 'node-fetch'

const USER_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhMWQ1MGZlZTIyMGJhMmY3YWI1OTUzNCIsInVzZXJuYW1lIjoicGV0dGVyIiwicGFzc3dvcmQiOiJwZXR0ZXIiLCJfX3YiOjAsImNoYXRzIjpbXSwicm9sZSI6IlVTRVIifSwicm9sZSI6IlVTRVIiLCJpYXQiOjE1MTE4NzA3MzAsImV4cCI6MTUxMjczNDczMH0.-_nFv57h-IagPVwCtsDmG0N-PkgMkiaAj2k4sYhVpLo'

const arrayRegex = /\[.*]/

const isArrayEndpoint = (entity) => {
    return entity.match(arrayRegex) !== null
}

const get = async (url) => {
    const response = await fetch(
        url,
        {
            method: 'get',
            headers: {
                'Authorization': ''
            }
        }
    );
    if (response.ok) {
        const json = await response.json()
        console.log(json)
    } else {
        console.log(response.status)
    }
};

const compareResults = (requestData, responseData) => {

    for (let key in responseData) {
        if (typeof requestData[key] !== 'undefined') {
            if (requestData[key] === responseData[key]) {
                console.log(`Property ${key} is writeable`)
            } else {
                console.log(`Property ${key} is NOT writeable`)
            }
        } else {
            console.log(`property ${key} not tested`)
        }
    }
};

const post = async (url, sample) => {
    const response = await fetch(
        url,
        {
            method: 'post',
            body: sample,
            headers: {
                'Authorization': USER_ACCESS_TOKEN
            }
        }
    );
    if (response.ok) {
        const json = await response.json()
        compareResults(sample,json)
    } else {
        console.log(response.status)
    }
};

const executeHttpMethod = (httpMethod, relativePath) => {
    const fullPath = `${api.rootPath}/${relativePath}`
    const sample = httpMethod.sample
    switch (httpMethod.methodName) {
    case 'GET':
        get(fullPath)
        break

    case 'POST':
        post(fullPath, sample)
        break
    }
};

const parseEndpoint = (endpoint) => {
    endpoint.httpMethods.forEach((it) => {
        executeHttpMethod(it, endpoint.relativePath)
    })
};

api.endpoints.forEach(parseEndpoint);
