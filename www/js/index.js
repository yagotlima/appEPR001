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

function abreView(view, titulo) {
	$(viewAberta).animate({width: 'hide'}, function() {$(view).animate({width: 'show'});});
	viewAberta = view;
	$('#titulo').text(titulo);
}

function calculaTaxaJuros() {
    var pv = $('#form1 input[name=vista]').val() - $('#form1 input[name=entrada]').val();
    var pmt = $('#form1 input[name=prazo]').val();
    var n = $('#form1 input[name=vezes]').val();
    
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
            $('#taxa').text((taxa*100).toFixed(3) + "%");
            break;
        }
        
        if(erro > 0)
			max = taxa;
		else
			min = taxa;
    }

	taxa = Math.pow(taxa + 1, 12) -1 //Taxa ao ano

	$('#form1 #taxa').text(taxa);
	$('#form1 #resultado').text(taxa > parseFloat($('#form1 #poupanca').html()) ? 'Compre a vista!' : 'Compre a prazo!' );
	$('#form1 #resultado').css('color', '#f00');
}

function calculaRendimentos() {
    var taxa = $('#form2 input[name=taxa]').val() / 100;
    var capitalInicial = $('#form2 input[name=inicial]').val();
    var periodo = $('#form2 input[name=vezes]').val();
    var aplicacoes = $('#form2 input[name=prazo]').val();
    var rendimento, total;

    var montante1, montante2;

    montante1 = capitalInicial * Math.pow((1+taxa), periodo);
    montante2 = aplicacoes*(1+taxa) * ((Math.pow((1+taxa), periodo) - 1) / taxa);

    rendimento = (montante2 + montante1) - capitalInicial - periodo*aplicacoes;
    total = montante1 + montante2;

	$('#form2 #resultado').text('Valor ao final da aplicação: R$' + total);
}

function atualizaTaxas() {
}

