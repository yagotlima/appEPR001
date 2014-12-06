/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var viewAberta = '#pagina1';

function showSpinner(){
	$('#spinner').stop().fadeIn();
}

function hideSpinner(){
	$('#spinner').stop().fadeOut();
}

function abreView(view, titulo) {
	$(viewAberta).animate({width: 'hide'}, function() {$(view).animate({width: 'show'});});
	viewAberta = view;
	$('#titulo').text(titulo);
}

function calculaPoupanca(pmt, taxa, n){
        var sum = 0;
        var i;
        for(i=1; i<=n; i++){
            sum += (pmt/Math.pow(1+taxa, i));
        }
        return sum;
}

function calculaTaxaJuros() {
	showSpinner();

    var pv = $('#form1 input[name=vista]').val() - $('#form1 input[name=entrada]').val();
    var pmt = $('#form1 input[name=prazo]').val();
    var n = $('#form1 input[name=vezes]').val();
    var x = 0, taxaPoupanca = 0.005;
    
    var min = 0;
    var max = 200;
    var taxa, erroAnterior, erro = 99999999999999.0;
    var valorPresente, valorFuturo;
    const PRECISAO = 0.0000001;

    while(true){
        taxa = (min + max) / 2.0;
        erroAnterior = erro;
        valorFuturo = pmt * ((Math.pow((taxa+1), n)-1)/taxa);
        valorPresente = valorFuturo/Math.pow(taxa+1.0, n);
        erro = pv - valorPresente;

        if(Math.abs(erro) < PRECISAO || Math.abs(erro - erroAnterior) < PRECISAO){
            //$('#taxa').text((taxa*100).toFixed(3) + "%");
            break;
        }
        
        if(erro > 0)
			max = taxa;
		else
			min = taxa;
    }

	x = calculaPoupanca(pmt, taxaPoupanca, n);

	//taxa = (Math.pow(taxa + 1, 12) - 1)*100; //Taxa ao ano em %

	$('#form1 #resultado').css('color', '#00f');
	$('#form1 #resultado').css('background-color', '#fc0');
	$('#form1 #resultado').css('font-size', 18);
	
    taxa*=100;

	if (pv==0 || n==0 || pmt==0) {
		$('#form1 #resultado').text('Entrada inválida! Preencha corretamente os campos');
	}else{
		$('#form1 #taxa').text(taxa.toFixed(3) + "% a.m");

		if(x > pv){
			if (taxa > 6) {
				$('#form1 #resultado').text('A taxa de juros esta muito alta, procure um banco que faça um empréstimo de R$' + pv.toFixed(2) + ' a uma taxa menor que ' + taxa.toFixed(1) + '% e você economizará.');
			    $('#form1 #resultado').css('font-size', 15);
			}else{
				$('#form1 #resultado').text('Compre a vista!');
			}
		}else{
			$('#form1 #resultado').text('Compre a prazo, invista R$' + x.toFixed(2) + " hoje na poupança e pague com retiradas mensais de R$" + (pmt*1.00).toFixed(2));
		    $('#form1 #resultado').css('font-size', 15);
		}
	}

	hideSpinner();
}

function calculaRendimentos() {
	showSpinner();

    var taxa = $('#form2 input[name=taxa]').val() / 100;
    var capitalInicial = $('#form2 input[name=inicial]').val();
    var periodo = $('#form2 input[name=periodos]').val();
    var aplicacoes = $('#form2 input[name=prazo]').val();
    var rendimento, total;

    var montante1, montante2;

    montante1 = capitalInicial * Math.pow((1+taxa), periodo);
    montante2 = aplicacoes*(1+taxa) * ((Math.pow((1+taxa), periodo) - 1) / taxa);

    rendimento = (montante2 + montante1) - capitalInicial - (periodo)*aplicacoes;
    total = montante1 + montante2;

    if(isNaN(total) || isNaN(rendimento)){
    	$('#form2 #resultado').text('Entrada inválida, preencha os campos corretamente.');
    	$('#form2 #resultado').css('font-size', 18);
    }else{
	    $('#form2 #resultado').text('Valor total ao final da aplicação: R$' + total.toFixed(2));
	    $('#form2 #resultado').css('font-size', 16);
		$('#form2 #resultado2').text('Rendimentos: R$' + (rendimento).toFixed(2));	
		$('#form2 #resultado2').css('font-size', 16);
    }
    $('#form2 #resultado').css('color', '#00f');
    $('#form2 #resultado').css('background-color', '#fc0');
    $('#form2 #resultado2').css('color', '#00f');
    $('#form2 #resultado2').css('background-color', '#fc0');

    hideSpinner();
}

function atualizaTaxasNaPagina(poupanca, selic, data) {
	$('.poupanca').each(function() {
		$( this ).text(poupanca);
	});
	$('.selic').each(function() {
		$( this ).text(selic);
	});

	//$('#dataTaxas').text('Atualizado em ' + new Date($.now()).toLocaleString());
	$('#dataTaxas').text('Atualizado em ' + data); //TODO: Inserir uma mensagem mais coerente.
}

function atualizaTaxas() {
	$.ajax({
		url: "http://epr001-ytlima.rhcloud.com/taxas.json",
		crossDomain: true,
		dataType: "json",
		beforeSend: function() {showSpinner();},
		complete: function() {hideSpinner();},
		error: function() {
			alert('Não foi possivel atualizar as taxas de juros.\nPor favor, verifique sua conexão');
		},
		success: function(resposta) {
            var jsonStr = JSON.stringify(resposta);
			atualizaTaxasNaPagina(resposta.poupanca, resposta.selic, resposta.data);
            localStorage.setItem('taxas', jsonStr);
		}
	});
}

function inicializaTaxas(){
    showSpinner();

    var taxasStr = localStorage.getItem('taxas');
    var taxas;
    if(taxasStr){
        taxas = JSON.parse(taxasStr);
        atualizaTaxasNaPagina(taxas.poupanca, taxas.selic, taxas.data);
    }

    hideSpinner();
}

