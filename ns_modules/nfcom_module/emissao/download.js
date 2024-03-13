const nsAPI = require('../../api_module/nsAPI')
var fs = require('fs');
const util = require("../../api_module/util")
'use strict';

const url = "https://nfcom.ns.eti.br/nfcom/get"

class Body {
    constructor(chNFCom, tpDown, tpAmb) {
        this.chNFCom = chNFCom;
        this.tpDown = tpDown;
        this.tpAmb = tpAmb;
    }
}

class Response {
    constructor({status, motivo, chNFCom, xml, pdf, nfcomProc, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.chNFCom = chNFCom;
        this.xml = xml;
        this.pdf = pdf;
        this.json = JSON.stringify(nfcomProc);
        this.erros = erros
    }
}

async function sendPostRequest(body, caminho) {
    
    try {
        
        let responseAPI = new Response(await nsAPI.PostRequest(url, body))

        if (responseAPI.json != null) {
            util.salvarArquivo(caminho, responseAPI.chNFCom, "-nfcomProc.json", responseAPI.json)
        }

        if (responseAPI.pdf != null) {
            let data = responseAPI.pdf;
            let buff = Buffer.from(data, 'base64');
            util.salvarArquivo(caminho, responseAPI.chNFCom, "-nfcomProc.pdf", buff)
        }

        if (responseAPI.xml != null) {
            util.salvarArquivo(caminho, responseAPI.chNFCom, "-nfcomProc.xml", responseAPI.xml)
        }

        return responseAPI
    } 
    
    catch (error) {
        util.gravarLinhaLog("[ERRO_DOWNLOAD]: " + error)
        return error
    }
    

}

module.exports = { Body, sendPostRequest }