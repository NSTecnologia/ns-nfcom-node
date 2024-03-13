const nsAPI = require('../../api_module/nsAPI');
const { gravarLinhaLog } = require('../../api_module/util');
const url = "https://nfcom.ns.eti.br/nfcom/issue/status"

class Body {
   constructor(CNPJ, nsNRec, tpAmb) {
       this.CNPJ = CNPJ;
       this.nsNRec = nsNRec;
       this.tpAmb = tpAmb
   }
}

class Response {
    constructor({status, motivo, chNFCom, cStat,xMotivo, xml, nProt, dhRecbto, erro}) {
        this.status = status;
        this.motivo = motivo;
        this.chNFCom = chNFCom;
        this.cStat = cStat;
        this.xMotivo = xMotivo;
        this.nProt = nProt;
        this.xml = xml;
        this.dhRecbto = dhRecbto;
        this.erro = erro
    }
}

async function sendPostRequest(body) {
    
    try {
        let responseAPI = new Response(await nsAPI.PostRequest(url, body))
        return responseAPI
    } 
    
    catch (error) {
        gravarLinhaLog("[ERRO_CONSULTA_STATUS_PROCESSAMENTO]: " + error)
        return error
    }

}

module.exports = { Body, sendPostRequest }