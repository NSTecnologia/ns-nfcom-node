# ns-nfcom-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para NFCom da NS Tecnologia.

Para implementar esta biblioteca em seu projeto, você pode:

1. Realizar a instalação do [pacote](https://www.npmjs.com/package/ns-nfcom-node) através do npm:

       npm install ns-nfcom-node

2. Realizar o download da biblioteca pelo [GitHub](https://github.com/NSTecnologia/ns-nfcom-node.git) e adicionar a pasta "ns-modules" em seu projeto.

# Exemplos de uso do pacote

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisições. 

Para isso, crie um arquivo chamado `configParceiro.js`, e nele adicione:

       const token = ""
       const CNPJ = ""

       module.exports = {token, CNPJ}
       
Dessa forma, o pacote conseguirá importar as suas configurações, onde você estará informando o token da software house e o cnpj do emitente.

## Emissão

Para realizarmos a emissão de uma NFCom, vamos utilizar os seguintes métodos.

Primeiramente, vamos fazer referencia da classe *emitirSincrono*, para utilizarmos o método **emitirNFComSincrono**

       const nsAPI = require('ns-nfcom-node/ns_modules/nfcom_module/emissao/emitirSincrono')

O segundo passo é importar, ou construir o arquivo de emissão em **.json** da NFCom.

       const nfcomJSON = require('./nfcom.json')
           
Apos isso, vamo utilizar o método **sendPostRequest** da classe *EmissaoSincrona* para realizar o envio deste documento NFCom para a API.
Este método realiza a emissão, a consulta de status de processamento e o download de forma sequencial.

       var retorno = nsAPI.emitirNFComSincrono(nfcomJSON,"2","X","Documentos/NFCom")
       retorno.then(()=>)

Os parâmetros deste método são:

+ *nfcomJSON* = objeto NFCom que será serializado para envio;
+ *2* = tpAmb = ambiente onde será autorizado a NFCom. *1 = produção, 2 = homologação / testes* ;
+ *"X"* = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
+ *"Documentos/NFCom"* = diretório onde serão salvos os documentos obtidos no download;

O retorno deste método é um objeto json contendo um compilado dos retornos dos métodos realizados pela emissão sincrona:

       responseSincrono {
           statusEnvio: 200,
           statusConsulta: 200,
           statusDownload: 200,
           cStat: 100,
           motivo: 'Consulta realizada com sucesso',
           xMotivo: 'Autorizado o uso da NFCom',
           nsNRec: '3753664',
           chNFCom: '43210914139046000109550000000257891100116493',
           nProt: '135210000895542',
           xml: '<?xml version="1.0" encoding="utf-8"?><nfcomProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfcom"><NFCom><infNFCom versao=...</nfcomProc>',
           erros: undefined // array de erros quando a comunicação, emissão, ou processamento apresentar erros
         }
       
    
Podemos acessarmos os dados de retorno e aplicarmos validações da seguinte forma. Tenhamos como exemplo:

       if (retorno.statusEnvio == "200" || retorno.statusEnvio == "-6" || retorno.statusEnvio == "-7") {
           var statusEnvio = retorno.statusEnvio;
           var nsNRec = retorno.nsNRec;

           // Verifica se houve sucesso na consulta
           if (retorno.statusConsulta == "200") {
               var statusConsulta = retorno.statusConsulta
               var motivo = retorno.motivo
               var xMotivo = retorno.xMotivo

               // Verifica se a nota foi autorizada
               if (retorno.cStat == "100" || retorno.cStat == "150") {
                   // Documento autorizado com sucesso
                   var cStat = retorno.cStat
                   var chNFCom = retorno.chNFCom
                   var nProt = retorno.nProt
                   var statusDownload = retorno.statusDownload

                   if (retorno.statusDownload == "200") {
                       // Verifica de houve sucesso ao realizar o downlaod da NFCom
                       let xml = retorno.xml
                   }

                   else {
                       // Aqui você pode realizar um tratamento em caso de erro no download
                       statusDownload = retorno.statusDownload
                       let erros = retorno.erros
                   }
               }

               else {
                   // NFCom não foi autorizada com sucesso ou retorno diferente de 100 / 150
                   motivo = retorno.motivo
                   xMotivo = retorno.xMotivo
                   let erros = retorno.erros
               }
           }

           else {
               // Consulta não foi realizada com sucesso ou com retorno diferente de 200
               var motivo = retorno.motivo;
               var xMotivo = retorno.xMotivo;
               var erros = retorno.erros;
           }
       }
       else {
           // NFCom não foi enviada com sucesso
           var statusEnvio = retorno.statusEnvio;
           var motivo = retorno.motivo;
           var xMotivo = retorno.xMotivo;
           var erros = retorno.erros;
       }

### Informações Adicionais

Para saber mais sobre o projeto NFCom API da NS Tecnologia, consulte a [documentação](https://documentacao.nstecnologia.com.br/docs/ns-nfcom/)


