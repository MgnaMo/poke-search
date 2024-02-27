$(document).ready(function(){
    $('#pokemonInfo').addClass('hidden');
    $('#chartContainer').addClass('hidden');

    $('#formularioPokemon').submit(function(event) {
        event.preventDefault();
        limpiar();
    
        var pokemonId = $('#pokemonId').val();
        var resultado = validar(pokemonId);
    
        if (resultado == true) {
            buscarPokemon(pokemonId);
            exito();
        };
    });

    function limpiar() {
        $('.resultado').html('');
        $('.errorNumero').html('');
        $('#pokemonInfo').addClass('hidden');
        $('#chartContainer').addClass('hidden');
    }

    function exito() {
        $('.resultado').html('¡Hemos encontrado a tu pokémon!');
        $('#pokemonInfo').removeClass('hidden');
    }

    function validar(numero) {
        var pasamosLaValidacion = true;
    
        var validacionNumero = /^[0-9]+$/;
    
        if (validacionNumero.test(numero) == false || numero < 1 || numero > 807) {
            $('.errorNumero').html('<h3>Por favor, ingresar un número válido o dentro del rango</h3>');
            pasamosLaValidacion = false;
        }
    
        return pasamosLaValidacion;
    }

    function buscarPokemon(id){
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function(data){
                $('#noshow').show();
                $('#pokemonImage').attr('src', data.sprites.front_default);
                $('#pokemonName').text(`Nombre: ${data.name}`);
                $('#pokemonAbility').text(`${data.abilities[0].ability.name}`);
                $('#pokemonBaseExperience').text(`${data.base_experience}`);
                $('#pokemonHeight').text(`${data.height}`);
                $('#pokemonWeight').text(`${data.weight}`);
                $('#pokemonType').text(`${data.types.map(type => type.type.name).join(', ')}`);
                if (data.species.url) {
                    $.ajax({
                        url: data.species.url,
                        type: 'GET',
                        dataType: 'json',
                        success: function(species){
                            if (species.evolves_from_species) {
                                $('#pokemonEvolvesTo').text(species.evolves_from_species.name);
                            } else {
                                $('#pokemonEvolvesTo').text('None');
                            }
                        },
                        error: function(error){
                            console.log(error);
                        }
                    });
                }
                var dataPoints = data.stats.map(stat => ({ y: stat.base_stat, label: stat.stat.name }));
                var chart = new CanvasJS.Chart('chartContainer', {
                    animationEnabled: true,
                    title: { text: 'Stats del Pokemon' },
                    data: [{
                        type: 'pie',
                        startAngle: 240,
                        yValueFormatString: '##0',
                        indexLabel: '{label} {y}',
                        dataPoints: dataPoints
                    }]
                });
                $('#pokemonInfo').removeClass('hidden');
                $('#chartContainer').removeClass('hidden');
                chart.render();
            },
            error: function(error){
                console.log(error);
            }
        });
    }
});

