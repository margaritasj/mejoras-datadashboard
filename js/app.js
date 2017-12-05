window.addEventListener('load', function (event) {
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

  var averageSatisfaction = document.getElementById('average-satisfied');

  var scoresTeacher = document.getElementById('scores-teacher');

  var scoresJedi = document.getElementById('scores-jedi');

  selection.addEventListener('change', showInformation);

  function showInformation() {
    //  console.log(e.target.value);
    // Agarramos el valor del selector y almacenamos en la variable
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

    /* -------------Punto N°1 - El total de estudiantes presentes por sede y generación.------------*/
    // Almacenamos la cantidad del arreglo students en una variable 
    var totalStudents = generationData['students'];
    var present = 0;
    var counter = 0;
    for (var i = 0; i < totalStudents.length; i++) {
      if (totalStudents[i].active === true) {
        present++;
        console.log(counter);
      } else {
        counter++;
        console.log(counter);
      }
    }

    // Datos de estudiantes inscritas
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '# estudiantes inscritas';
    div.appendChild(paragraph);
    div.classList.add('description');
    studentsInscribed.textContent = present;
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
    var totalStudentsN = generationData['students'].length;
    var deserted = counter;
    console.log(deserted);
    // Math.floor ---> Devuelve el máximo entero menor o igual a un número.
    studentsDeserted.textContent = Math.floor((deserted * 100) / totalStudentsN) + '%';
    studentsDeserted.appendChild(div);

    // Realizamos el gráfico  
    // Load Charts and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Draw the pie chart for Sarah's pizza when Charts is loaded.
    // google.charts.setOnLoadCallback(drawSarahChart);

    google.charts.setOnLoadCallback(drawChartEnrollment);

    // Callback that draws the pie chart for Enrollment pizza.
    function drawChartEnrollment() {
      // create the data table
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'S');
      data.addColumn('number', 'N');
      data.addRows([
        ['Present', present],
        ['Deserted', deserted],
      ]);
      

      // Set options for Enrollment pie chart.
      var options = { 
        title: 'Current Enrollment',
        width: 400,
        height: 300
      };
      // Instantiate and draw the chart for Sarah's pizza.
      var chart1 = new google.visualization.PieChart(document.getElementById('graph-enrollment'));
      chart1.draw(data, options);
    }

    /* --Punto N°3 - N° de estudiantes que superan la meta en promedio en todos los sprints tanto HSE y en tech.--*/
    // Total de estudientes que pasan el 70%
    var studentsCurrent = totalStudentsN - deserted;
    console.log(studentsCurrent);
    var studentsTarget = 0;
    var totalStudentsTech = 0;
    var totalStudentsHse = 0;
    generationData.students.forEach(function(student) {
      // Sacamos la cantidad de sprints y lo almacenamos en una variable
      var quantitySprints = student['sprints'].length;
      // Almacenaremos el total de la suma de tech y hse
      var total = 0;
      var totalTech = 0;
      var totalHse = 0;

      student.sprints.forEach(function(sprint) {
        total += (sprint.score.tech + sprint.score.hse);
        // Obtenemos el puntaje de tech y lo almacenamos en una variable
        var tech = sprint.score.tech;
        totalTech += tech;
        // Obtenemos el puntaje de hse
        var hse = sprint.score.hse;
        totalHse += hse;
      });

      // Al total le dividimos entre la cantidad de sprints y guardamos en un variable llamada promedio
      var average = total / quantitySprints;

      // TIP: total de puntos es 3000 (tech+hse) y su 70% es 2100
      if (average >= 2100) {
        studentsTarget++;
      }
      // TIP: total de puntajes tech es 1800 y su 70% es 1260
      var averageTech = totalTech / quantitySprints;
      if (averageTech >= 1260) {
        totalStudentsTech++;
      }
      // TIP: total de puntajes hse es 1200 y su 70% es 840
      var averageHse = totalHse / quantitySprints;
      if (averageHse >= 840) {
        totalStudentsHse++;
      }
    });

    // Pasaron la meta total 
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '# estudiantes que superan la meta';
    div.appendChild(paragraph);
    div.classList.add('description');
    studentsApproved.textContent = studentsCurrent - studentsTarget;
    studentsApproved.appendChild(div);

    /* ---Punto N°4 - El porcentaje que representa el dato anterior en relación al total de estudiantes.---*/
    // El porcentaje total 
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '% total';
    div.appendChild(paragraph);
    div.classList.add('description');

    var percentageApproved = Math.floor((studentsTarget * 100) / studentsCurrent);
    totalApproved.textContent = percentageApproved + '%';
    totalApproved.appendChild(div);

    /* ------ Punto N°5 - El Net Promoter Score (NPS) promedio de los sprints cursados. ------ */
    // bajo la siguiente fórmula: [NPS] = [Promoters] - [Detractors]

    var result = 0;
    for (var i = 0; i < generationData.ratings.length; i++) {
      var promoters = generationData.ratings[i].nps.promoters;
      var detractors = generationData.ratings[i].nps.detractors;
      var nps = promoters - detractors;
      result += nps;
    }
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '% de nps';
    div.appendChild(paragraph);
    div.classList.add('description');
    averageNps.textContent = Math.floor(((result / generationData.ratings.length) * 100) / 100) + '%';
    averageNps.appendChild(div);

    /* -- Punto N°6 - N° y % que representa el total de estudiantes que superan la meta tech.-- */
    // En N° la meta tech, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '# estudiantes que pasan la meta tech';
    div.appendChild(paragraph);
    div.classList.add('description');

    approvedTech.textContent = totalStudentsTech;
    approvedTech.appendChild(div);

    // En % la meta tech, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '% estudiantes que superan la meta tech';
    div.appendChild(paragraph);
    div.classList.add('description');

    averageTech.textContent = Math.floor((totalStudentsTech * 100) / totalStudentsN) + '%';
    averageTech.appendChild(div);

    /* -- Punto N°7 - N° y % que representa el total de estudiantes que superan la meta HSE.-- */
    // En N° la meta HSE, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '# estudiantes que superan la meta hse';
    div.appendChild(paragraph);
    div.classList.add('description');

    approvedHse.textContent = totalStudentsHse;
    approvedHse.appendChild(div);

    // En % la meta HSE, puntos técnicos en promedio y por sprint
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '% estudiantes superan la meta hse';
    div.appendChild(paragraph);
    div.classList.add('description');
    averageHse.textContent = Math.floor((totalStudentsHse * 100) / totalStudentsN) + '%';

    averageHse.appendChild(div);

    /* ----Punto N°8 - El porcentaje de estudiantes satisfechas con la experiencia de Laboratoria.----*/
    // El porcentaje de estudiantes satisfechas con la experiencia de Laboratoria.
    var totalStudent = 0;
    for (var i = 0; i < generationData.ratings.length; i++) {
      var meet = generationData.ratings[i].student.cumple;
      var beats = generationData.ratings[i].student.supera;
      var totalSatisfaction = meet + beats;
      totalStudent += totalSatisfaction;
    }
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = '% estudiantes satisfechas';
    div.appendChild(paragraph);
    div.classList.add('description');

    averageSatisfaction.textContent = Math.floor(((totalStudent / generationData.ratings.length) * 100) / 100) + '%';
    averageSatisfaction.appendChild(div);

    /* ------ Punto N°9 - La puntuación promedio de l@s profesores. ------*/
    var totalRatingTeacher = 0;
    for (var i = 0; i < generationData.ratings.length; i++) {
      var teacher = generationData.ratings[i].teacher;
      totalRatingTeacher += teacher;
    }

    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    paragraph.textContent = 'puntuación a l@s profesores';
    div.appendChild(paragraph);
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
    var paragraph = document.createElement('p');
    paragraph.textContent = 'puntuación a l@s jedi masters';
    div.appendChild(paragraph);
    div.classList.add('description');

    scoresJedi.textContent = (totalRatingJedi / generationData.ratings.length).toFixed(2);
    scoresJedi.appendChild(div);
  };
  /* -------------------------------------------------------------------------------------------- */
  for (var i = 0; i < tabs.length; i++) {
    // Agregar el evento click a todos los tabs
    tabs[i].addEventListener('click', function (event) {
      for (var ii = 0; ii < tabs.length; ii++) {
        // Quitar la clase active a todos los tabs
        tabs[ii].classList.remove('active');
      }

      for (var jj = 0; jj < contents.length; jj++) {
        // Quitar la clase active a todos los contents
        contents[jj].classList.remove('active');
      }

      // Agregar la clase active solo a este tab que se le dio click
      event.target.classList.add('active');
      // Agregar la clase active solo al content correspondiente (data-content)
      contents[event.target.dataset.content].classList.add('active');
    });
  }

  showInformation();
  tabs[0].classList.add('active');
  contents[0].classList.add('active');
});