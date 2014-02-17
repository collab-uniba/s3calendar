//define student URL - in this way the addons work only on the URLs specified.
    var studentPage = "https://www.studenti.ict.uniba.it/esse3/auth/studente/Appelli/BachecaPrenotazioni"; //student URL
    var docentPage = "https://www.studenti.ict.uniba.it/esse3/auth/docente/CalendarioEsami/ElencoAppelliCalEsa"; //teacher URL
    //docentPage = "calendario"; //test var
	
	
	/*************************************************************************************
	 Action on mouse click: add an event on Google Calendar
	*************************************************************************************/
	doAction = function(i, r) {
		addToGoogleCalendar(getInfo(i, r));
	};
	
	/*************************************************************************************
	 This method provide the add event button
	*************************************************************************************/
	
	
	createInput = function(i, r) {
		var imageUrl = self.options.img;

		var button = "<img id='googleCalendar"+i+"' name='imageField' alt='Aggiungi a Calendar' title='Aggiungi a Calendar' " + 
					"style='cursor: pointer;' src='" + imageUrl + "'>";
		document.getElementById('calendar'+i).innerHTML += button;
		document.getElementById('googleCalendar'+i).addEventListener("mouseup", function(event) {
              doAction(i, r);
            }, false);
		
	};
	
	/*************************************************************************************
	 This method work on the html code of Esse3 page. It add an icon near each event and
	 provide a way for adding this event into Google Calendar
	*************************************************************************************/
	main = function() {
		
		//add event button in student view
		if (document.URL.indexOf(studentPage) != -1) {
		    //Search all exams table
			var table_class_s = document.querySelectorAll('table.detail_table');
			for (var i=0;i<table_class_s.length;i=i+1){
				//for each table , add a column with add event button. This instruction is executed once time for each table, because each table have only one exam-row
				var tr_table_s = table_class_s[i].getElementsByTagName('tr');
				tr_table_s[0].getElementsByTagName('th')[0].colSpan = 8;
				for (var r=0; r<tr_table_s.length; r=r+1){
					if (tr_table_s[r].getElementsByTagName('th')[0].innerHTML.indexOf("Giorno") != -1) {
						var rowSpan = tr_table_s[r+2].getElementsByTagName('td')[0].rowSpan;
						tr_table_s[r].innerHTML += "<th width='' class='detail_table' valign='top' rowspan='2' colspan='1'>Calendario</th>";
						tr_table_s[r+2].innerHTML += "<td width='' id='calendar"+i+"' class='detail_table' valign='center' rowspan='" + rowSpan + "' style='text-align:center;'></td>";
						createInput(i, r);
						break;
					}
				}
			}
		//add event button in teacher view	
		} else if (document.URL.indexOf(docentPage) != -1) {
			//Search all exams table
			var table_class_d = document.querySelectorAll('table.detail_table');
			//for each table row, add a column with add event button. Scan the tables, and for each table scan all rows and add the button.
			for (var j=0;j<table_class_d.length;j=j+1){
				var tr_table_d = table_class_d[j].getElementsByTagName('tr');
				tr_table_d[0].getElementsByTagName('th')[5].colSpan = 4;
				tr_table_d[0].getElementsByTagName('th')[5].width = 80;
				for (var k=1;j<tr_table_d.length;k=k+1){
					tr_table_d[k].innerHTML += "<td width='' id='calendar"+j+"_"+k+"' class='detail_table_middle' valign='center' style='text-align:center;' rowspan='1' colspan='1'></td>";
					createInput(j+"_"+k);
				}
			}
			
		
		}
	};

	/*************************************************************************************
	 This method capitalize the first letter of each word in a string.
	 INPUT: word:string
	 OUTPUT: capitalize: string.
	 
	 EG. SCIENCE DEPARTMENT -> Science Department
	*************************************************************************************/
	stringCapitalize = function(word){
		var split_word = word.split(" ");
		var output = "";
		for (var j=0; j < split_word.length; j++){
			output = output + split_word[j].substring(0,1).toUpperCase() + split_word[j].substring(1,split_word[j].length).toLowerCase(); 
			output = output +" ";
		}
		return output;
	};
	
	/*************************************************************************************
	 This method retrieve exam info from Esse3. It work in two different way: one for
	 student and one for teacher.
	*************************************************************************************/
	getInfo = function(index, r){
		if (document.URL.indexOf(studentPage) != -1) {
			return getInfoStudent(index, r);
		} else if (document.URL.indexOf(docentPage) != -1) {
			return getInfoDocent(index);
		}

	};
	
	/*************************************************************************************
	 This method retrieve exam info from teacher page onEsse3. 
	 INPUT: an index in this form: TableIndex_RowIndex
	 OUTPUT: informations array (name,date,hour,location)
	*************************************************************************************/
	getInfoDocent = function(index){
	    //split index in table index and row index
		var table = index.charAt(0);
		var row = index.charAt(2);
		//retrieve all info-table
		var info_class = document.querySelectorAll('table.detail_table');
		//select the table specified by the table index
		var infotab = info_class[table].getElementsByTagName('tr');
		//retrive the html div with exam name and location
		var div_name = document.querySelectorAll('div#esse3old')[table].getElementsByTagName('table')[2].getElementsByTagName('table')[0];
		//exam name
		var name_prefix = div_name.getElementsByClassName('legenda3')[0].textContent;
		name_prefix = name_prefix.substring(12,name_prefix.length);
		name_prefix = name_prefix.split('[')[0];
		//exam type
		var name_suffix = infotab[row].getElementsByTagName('td')[0].textContent;
		//name = exam name + exam type
		var type = examType(name_suffix);
		var name = type+" "+stringCapitalize(name_prefix);
		//retrieve date and hour and split them
		var date_hour = infotab[row].getElementsByTagName('td')[2].textContent;
		var date = date_hour.substring(0,10);
		var hour = date_hour.substring(11,date_hour.lenght);
		hour = hour.replace(" ", "");
		//retrieve location 
		var place = div_name.getElementsByClassName('tplMessage')[0].textContent;
		info = ["","","",""];
		//construct output
		info[0] = stringCapitalize(name);
		info[1] = date;
		info[2] = hour;
		info[3] = place;
		return info;
	};
	
	/*************************************************************************************
	 This method retrieve exam info from student page onEsse3. 
	 INPUT: table index
	 OUTPUT: informations array (name,date,hour,location)
	*************************************************************************************/
	getInfoStudent = function(index, r){
	    //retrieve exam name from hidden field
		var name = document.getElementsByName("AD_DES")[index].value;
		//retrieve all informations table
		var info_class = document.querySelectorAll('table.detail_table');
		//select the rows of specified table (index)
		var infotab = info_class[index].getElementsByTagName('tr');
		var type = examType(infotab[r-1].getElementsByTagName('th')[0].textContent);
		//retrieve date, hour and location
		var date = infotab[r+2].getElementsByTagName('td')[0].textContent;
		var hour = infotab[r+2].getElementsByTagName('td')[1].textContent;
		var place = infotab[r+2].getElementsByTagName('td')[2].textContent;
		var aula = infotab[r+2].getElementsByTagName('td')[3].textContent;

		//construct informations array
		info = ["","","",""];
		info[0] = stringCapitalize(type+" "+name);
		info[1] = date;
		info[2] = hour;
		info[3] = place + " " + aula;
		return info;
	};

	/*************************************************************************************
	 This method add a specified event to Google Calendar 
	 INPUT: array with event info
	*************************************************************************************/
	addToGoogleCalendar = function(info){
	    //format informations
		var calendar_name = self.options.calendar;
		var split_data = info[1].split("/");
		var split_ora =  info[2].split(":");
		var data = split_data[2] + split_data[1] + split_data[0];
		var oraInizio = split_ora[0] + split_ora[1];
		//duration 3 hour default
		var oraF = parseInt(split_ora[0]) + 3;
		var oraFine= oraF + split_ora[1];
		var text = info[0].replace(" ","+");
		var where = info[3].replace(" ","+");
		//construct Google Calendar URL
		var indirizzo= "https://www.google.com/calendar/render?action=TEMPLATE&src=" +calendar_name+ "&text=" + text + 
		"&dates=" + data + "T"+ oraInizio + "00/"+ data + "T" + oraFine +"00&location="+where+"%0A%0A&sf=true&output=xml";
		//Open new browser window due to confirm event adding.
		window.open(indirizzo,"blank");
	};
	
		/*************************************************************************************
	 This method retrieve exam type from an input string. 
	 INPUT: string to parse
	 OUTPUT: exam type string
	*************************************************************************************/
	examType = function(str){
	   var scritto = "scritto";
	   var laboratorio = "laboratorio";
	   var orale = "orale";
	   var scritta = "scritta";
	   var empty ="";
	   str = str.toLowerCase();
	   if (str.indexOf(scritto) != -1)
	      return stringCapitalize(scritto)+"-";
	   if (str.indexOf(scritta) != -1)
	      return stringCapitalize(scritta)+"-";
	   if (str.indexOf(laboratorio) != -1)
	      return stringCapitalize(laboratorio)+"-";
	   if (str.indexOf(orale) != -1)
	      return stringCapitalize(orale)+"-";
	   return empty; 
	};

 	main();