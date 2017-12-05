window.addEventListener('load', function () {

  var selection = document.getElementById('selection');
  // var contenidoSede = document.getElementById('contenido-sede');

  var tabs = document.getElementsByClassName('tab');
  var contents = document.getElementsByClassName('content');

  var studentsInscribed = document.getElementById('students-inscribed');
  var studentsDeserted = document.getElementById('students-deserted');

  var studentsApproved = document.getElementById('students-approved');
  var totalApproved = document.getElementById('total-approved');

  var averageNps = document.getElementById('average');

  var approvedTech = document.getElementById('approved-tech');
  var averageTech = document.getElementById('average-tech');

  var approvedHse = document.getElementById('approved-hse');
  var averageHse = document.getElementById('average-hse');

  var averageSatisfied = document.getElementById('average-satisfied');

  var scoresTeacher = document.getElementById('scores-teacher');

  var scoresJedi = document.getElementById('scores-jedi');
  var averageTotal = document.getElementById('average-total');

  selection.addEventListener('change', mostrarInfo);

  function mostrarInfo() {
    //  console.log(e.target.value);
    // Agarramos el valor de selection y almacenamos en la variable
    var value = selection.value;
    // console.log(value);

    // El método split convertira una cadena a un array 
    var aux = value.split('-');
    // console.log(aux);

    // El método shift elimina un elemento del inicio del array y retorna el elemento eliminado que lo almacenare en una variable llamada sedeName
    var sedeName = aux.shift();
    // console.log(sedeName);

    // El método join convierte un array a una cadena separado por un guion 
    var generation = aux.join('-');

    // Almacenamos toda la data en una variable  
    var generationData = data[sedeName][generation];

    // Almacenamos el length de students en una variable
    var totalStudentsN = generationData['students'].length;

    /* -------------Punto N°1 - El total de estudiantes presentes por sede y generación.------------*/
    // Almacenamos la cantidad del arreglo students en una variable 
    var totalStudents = generationData['students'];
    var activeStudents = 0;
    var noActiveStudents = 0;
    for (var i = 0; i < totalStudents.length; i++) {
      if (totalStudents[i].active === true) {
        activeStudents++;
        console.log(activeStudents);
      } else {
        noActiveStudents++;
        console.log(noActiveStudents);
      }
    }

    // Datos de estudiantes inscritas
    var studentPresent = activeStudents;
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '# estudiantes inscritas';
    div.appendChild(paragraph);
    div.classList.add('description');
    studentsInscribed.textContent = studentPresent;
    studentsInscribed.appendChild(div);

    /* -----------------Punto N°2 - El porcentaje de deserción de estudiantes.----------------*/
    // El método forEach() ejecuta la función indicada una vez por cada elemento del array en orden ascendente.//
    // salida:
    // students[0].active = true
    // students[1].active  = false 1
    // students[2].active  = false 1 + 1 = 2 ----> (counter) 
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '% estudiantes desertoras';
    div.appendChild(paragraph);
    div.classList.add('description');

    // Datos de estudiantes que desartaron
    var studentDesert = noActiveStudents;
    console.log(studentDesert);
    // Math.floor ---> Devuelve el máximo entero menor o igual a un número.
    studentsDeserted.textContent = Math.floor((studentDesert * 100) / totalStudentsN) + '%';
    studentsDeserted.appendChild(div);

    // Realizamos el gráfico  
    // Load Charts and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Draw the pie chart for Enrollment pizza when Charts is loaded.
    // google.charts.setOnLoadCallback(drawSarahChart);

    google.charts.setOnLoadCallback(drawChartEnrollment);

    // Callback that draws the pie chart for Enrollment pizza.
    function drawChartEnrollment() {
      // create the data table
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'S');
      data.addColumn('number', 'N');
      data.addRows([
        ['Present', studentPresent],
        ['Deserted', studentDesert],
      ]);


      // Set options for Enrollment pie chart.
      var options = {
        title: 'Current Enrollment',
        width: 350,
        height: 250,
        colors: ['#ffc107', '#3a3835']
      };
      // Instantiate and draw the chart for Enrollment pizza.
      var chart1 = new google.visualization.PieChart(document.getElementById('graph-enrollment'));
      chart1.draw(data, options);
    }

    /* --Punto N°3 - N° de estudiantes que superan la meta en promedio en todos los sprints tanto HSE y en tech.--*/
    // Total de estudientes que pasan el 70%
    var studentsTarget = 0;
    var totalStudentsTech = 0;
    var totalStudentsHse = 0;
    generationData.students.forEach(function(student) {
      // Sacamos la cantidad de sprints y lo almacenamos en una variable
      var cantidadDeSprints = student.sprints.length;
      if (student.active === true) {
        var sumTech = 0;
        var sumHse = 0;
        student.sprints.forEach(function(sprint) {
          sumTech += sprint.score.tech;
          sumHse += sprint.score.hse;
        });

        var promedioTech = sumTech / cantidadDeSprints;
        var promedioHse = sumHse / cantidadDeSprints;

        if ((promedioTech >= 1260) && (promedioHse >= 840)) {
          studentsTarget++;
        }
        // TIP: total de puntajes tech es 1800 y su 70% es 1260
        if (promedioTech >= 1260) {
          totalStudentsTech++;
        }
        // TIP: total de puntajes hse es 1200 y su 70% es 840
        if (promedioHse >= 840) {
          totalStudentsHse++;
        }
      }

    });
    // Pasaron la meta total 
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '# estudiantes que superan la meta';
    div.appendChild(parrafo);
    div.classList.add('description');

    studentsApproved.textContent = studentsTarget;
    studentsApproved.appendChild(div);

    /* ---Punto N°4 - El porcentaje que representa el dato anterior en relación al total de estudiantes.---*/
    // El porcentaje total 
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.innerHTML = '% total' + '<br>' + activeStudents;
    div.appendChild(parrafo);
    div.classList.add('description');

    var porcentajePasaron = Math.floor((studentsTarget * 100) / activeStudents);
    totalApproved.textContent = porcentajePasaron + '%';
    totalApproved.appendChild(div);

    // Realizamos el gráfico  
    // Load Charts and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Draw the pie chart for Enrollment pizza when Charts is loaded.
    // google.charts.setOnLoadCallback(drawSarahChart);

    google.charts.setOnLoadCallback(drawChartAchievement);

    // Callback that draws the pie chart for Enrollment pizza.
    function drawChartAchievement() {
      // create the data table
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'S');
      data.addColumn('number', 'N');
      data.addRows([
        ['Superaron', porcentajePasaron],
        ['No superaron', studentsTarget],
      ]);


      // Set options for Enrollment pie chart.
      var options = {
        title: 'Current Achievement',
        width: 350,
        height: 250,
        colors: ['#ffc107', '#3a3835']
      };
      // Instantiate and draw the chart for Enrollment pizza.
      var chart2 = new google.visualization.PieChart(document.getElementById('graph-achievement'));
      chart2.draw(data, options);
    }

    /* -- Punto N°6 - N° y % que representa el total de estudiantes que superan la meta tech.-- */
    // En N° la meta tech, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '# estudiantes que pasan la meta tech';
    div.appendChild(parrafo);
    div.classList.add('description');

    approvedTech.textContent = totalStudentsTech;
    approvedTech.appendChild(div);

    // En % la meta tech, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '% estudiantes que superan la meta tech';
    div.appendChild(parrafo);
    div.classList.add('description');

    averageTech.textContent = Math.floor((totalStudentsTech * 100) / totalStudentsN) + '%';
    averageTech.appendChild(div);

    /* -- Punto N°7 - N° y % que representa el total de estudiantes que superan la meta HSE.-- */
    // En N° la meta HSE, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '# estudiantes que superan la meta hse';
    div.appendChild(parrafo);
    div.classList.add('description');

    approvedHse.textContent = totalStudentsHse;
    approvedHse.appendChild(div);

    // En % la meta HSE, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '% estudiantes superan la meta hse';
    div.appendChild(parrafo);
    div.classList.add('description');
    averageHse.textContent = Math.floor((totalStudentsHse * 100) / totalStudentsN) + '%';

    averageHse.appendChild(div);

    /* ------ Punto N°5 - El Net Promoter Score (NPS) promedio de los sprints cursados. ------ */
    // bajo la siguiente fórmula: [NPS] = [Promoters] - [Detractors]
    var rating = generationData['ratings'];
    var promoters = [];
    var passive = [];
    var detractors = [];
    var totalNps = [];
    var acumulativeNps = 0;
    var porcentajeAcumulativeNps;
    var porcentajePromotors = 0;
    var porcentajePassive = 0;
    var porcentajeDetractors = 0;
    var totalPromoters = 0;
    var totalPassive = 0;
    var totalDetractors = 0;

    for (var i = 0; i < rating.length; i++) {
      var nps = rating[i].nps.promoters - rating[i].nps.detractors;
      totalNps.push(nps);

      promoters.push(rating[i].nps.promoters);
      passive.push(rating[i].nps.passive);
      detractors.push(rating[i].nps.detractors);

      totalPromoters = totalPromoters + promoters[i];
      totalPassive = totalPassive + passive[i];
      totalDetractors = totalDetractors + detractors[i];
    }

    porcentajePromotors = totalPromoters * 100 / (totalPromoters + totalDetractors + totalPassive);
    porcentajeDetractors = totalDetractors * 100 / (totalPromoters + totalDetractors + totalPassive);
    porcentajePassive = totalPassive * 100 / (totalPromoters + totalDetractors + totalPassive);

    var promoters = (Math.round(porcentajePromotors) + '%' + '\t' + 'PROMOTER');
    var detractors = (Math.round(porcentajeDetractors) + '%' + '\t' + 'DETRACTORS');
    var passive = (Math.round(porcentajePassive) + '%' + '\t' + 'PASSIVE');

    // var porcentajeIndividual = document.getElementById('porcentajeVarios');
    averageTotal.innerHTML = promoters + '<br>' + passive + '<br>' + detractors;
    console.log(totalNps.length);

    for (var i = 0; i < totalNps.length; i++) {
      acumulativeNps = acumulativeNps + totalNps[i];
    }

    porcentajeAcumulativeNps = acumulativeNps / totalNps.length;

    var cumulativeNps = Math.round(porcentajeAcumulativeNps) + '%';

    // var cumulativeNpsShow = document.getElementById('cumulativeNps');
    average.innerHTML = cumulativeNps + '<br>' + '% CUMULATIVE NPS';

    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '% CUMULATIVE NPS';
    div.appendChild(parrafo);
    div.classList.add('description');

    averageNps.innerHTML = cumulativeNps;
    averageNps.appendChild(div);

    averageTotal.innerHTML = promoters + '<br>' + passive + '<br>' + detractors;

    /* ----Punto N°8 - El porcentaje de estudiantes satisfechas con la experiencia de Laboratoria.----*/
    // El porcentaje de estudiantes satisfechas con la experiencia de Laboratoria.
    var totalStudent = 0;
    for (var i = 0; i < generationData.ratings.length; i++) {
      var cumple = generationData.ratings[i].student.cumple;
      var supera = generationData.ratings[i].student.supera;
      var totalSatis = cumple + supera;
      totalStudent += totalSatis;
    }

    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = '% estudiantes satisfechas';
    div.appendChild(parrafo);
    div.classList.add('description');

    averageSatisfied.textContent = Math.floor(((totalStudent / generationData.ratings.length) * 100) / 100) + '%';
    averageSatisfied.appendChild(div);

    /* ------ Punto N°9 - La puntuación promedio de l@s profesores. ------*/
    var totalRatingTeacher = 0;
    for (var i = 0; i < generationData.ratings.length; i++) {
      var teacher = generationData.ratings[i].teacher;
      totalRatingTeacher += teacher;
    }

    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = 'puntuación a l@s profesores';
    div.appendChild(parrafo);
    div.classList.add('description');

    scoresTeacher.textContent = (totalRatingTeacher / generationData.ratings.length).toFixed(2);
    scoresTeacher.appendChild(div);

    /* ------Punto N°10 - La puntuación promedio de l@s jedi masters.------*/
    var totalRatingJedi = 0;
    generationData.ratings.forEach(function (rating) {
      var jedi = rating.jedi;
      totalRatingJedi += jedi;
    });
    var div = document.createElement('div');
    var parrafo = document.createElement('p');
    parrafo.textContent = 'puntuación a l@s jedi masters';
    div.appendChild(parrafo);
    div.classList.add('description');

    scoresJedi.textContent = (totalRatingJedi / generationData.ratings.length).toFixed(2);
    scoresJedi.appendChild(div);
  };

  for (var i = 0; i < tabs.length; i++) {
    // Agregar el evento click a todos los tabs
    tabs[i].addEventListener('click', function (event) {
      for (var j = 0; j < tabs.length; j++) {
        // Quitar la clase active a todos los tabs
        tabs[j].classList.remove('active');
      }

      for (var k = 0; k < contents.length; k++) {
        // Quitar la clase active a todos los contents
        contents[k].classList.remove('active');
      }

      // Agregar la clase active solo a este tab que se le dio click
      event.target.classList.add('active');
      // Agregar la clase active solo al content correspondiente (data-content)
      contents[event.target.dataset.content].classList.add('active');
    });
  }

  mostrarInfo();
  tabs[0].classList.add('active');
  contents[0].classList.add('active');
});