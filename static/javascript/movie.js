let body=a=div=span=h1=h2=nav=header=section=p=input=footer=table=tr=td=form=null

function initNav(){
	body=document.querySelector('body');
	nav=body.appendChild(document.createElement('nav'));
	div=nav.appendChild(document.createElement('div'));
	div.id="logo";
}

function initHeader(){
	body=document.querySelector('body');
	header=body.appendChild(document.createElement('header'));
	div=header.appendChild(document.createElement('div'));
	div.id="movie"
	div=header.appendChild(document.createElement('div'));
	div.id="movieinfo"
	div.style.padding="5% 0px";
	h1=div.appendChild(document.createElement('h1'));
	h1.innerHTML="Movie Reviews"
	h2=div.appendChild(document.createElement('h2'));
	h2.innerHTML="1950 - Present";
	h3=div.appendChild(document.createElement('h3'));
	h3.innerHTML="All Genres";
	h3.style.fontFamily="Broadway";
	initStats();
}


function initStats(){
	statpics=["url('../static/pictures/rt.png')", "url('../static/pictures/aud.jpg')"]
	stat_id=["rt", "aud"];
	for(i=0 ; i<2 ; i++)
	{
		div=document.getElementById('movieinfo').appendChild(document.createElement('div'));
		div.setAttribute("class", "stats");
		span=div.appendChild(document.createElement('span'));
		span.setAttribute("class", "statpic");
		span.style.backgroundImage = statpics[i];
		span=div.appendChild(document.createElement('span'));
		span.setAttribute("class", "score");
		span.id=stat_id[i];
	}
}

function setStats(stats){
    var rt=document.getElementById('rt');
    var aud=document.getElementById('aud');
    rt.innerHTML=stats[0] + '%';
    aud.innerHTML=stats[1] + '%';
}

function initSynopsisSection(){
	body=document.querySelector('body');
	section=body.appendChild(document.createElement('section'));
	h2=section.appendChild(document.createElement('h2'));
	h2.innerHTML="Synopsis"
	p=section.appendChild(document.createElement('p'));
	p.innerHTML="The year is 1963, the night: Halloween. Police are called to 43 Lampkin Ln. only to discover that 15 year old Judith Myers has been stabbed to death, by her 6 year-old brother, Michael. After being institutionalized for 15 years, Myers breaks out on the night before Halloween. No one knows, nor wants to find out, what will happen on October 31st 1978 besides Myers' psychiatrist, Dr. Loomis. He knows Michael is coming back to Haddonfield, but by the time the town realizes it, it'll be too late for many people.";
}

function initFooter(){
    footer=body.appendChild(document.createElement('footer'));
    h2=footer.appendChild(document.createElement('h2'));
    h2.innerHTML="CREATED BY";
    h2.style.fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif";
    table=footer.appendChild(document.createElement('table'));
    table.setAttribute("align", "center");
    creators=["Muhammad Ukasha", "Jawad Hussain", "Abdul Moeez", "Fa-16/BSCS/009", "Fa-16/BSCS/017", "Fa-16/BSCS/091", "", "Section A", ""];
    for(var i=0, x=0 ; i<3 ; i++)
    {
        tr=table.appendChild(document.createElement('tr'));
        for(var j=0 ; j<3 ; j++, x++)
        {
            td=tr.appendChild(document.createElement('td'));
            td.innerHTML=creators[x];
            td.setAttribute("align", "center");
        }
    }
}

function validateComment(){
    if(!document.getElementById('txt').value.toString())
    {
        alert('Please enter your review');
        return false;
    }
    return true;
}

function initSubmitEvent(){
    var btn=document.getElementById('btnSubmit');
    btn.addEventListener('click', computeSentiment);
}

function computeSentiment(){
    var txt=document.getElementById('txt').value;
    if(!txt.toString())
    {
        alert('Please enter your review');
        return;
    }
    var params= new FormData();
    params.append("review", txt.toString());
    var ajax= new XMLHttpRequest();
    ajax.open("POST", "http://localhost:5000/computesentiment", true);
    ajax.send(params);
    ajax.onload = function() {
        if (ajax.status == 200)
        {
            var jsonObj=JSON.parse(ajax.responseText);
            initSentimentSection(jsonObj);
            return true;
        }
    }
}

function addReview(eve)
{
    eve.target.disabled=true;
    var p=document.getElementById('reviewtoadd').innerHTML;
    if(!p)
    {
        alert('Invalid Review');
        return;
    }
    var params= new FormData();
    params.append("review", p);
    var ajax= new XMLHttpRequest();
    ajax.open("POST", "http://localhost:5000/addreview", true);
    ajax.send(params);
    ajax.onload = function() {
        if (ajax.status == 200)
        {
            eve.target.style.color="red";
            eve.target.style.borderColor="red";
            var div=document.getElementById('reviewcontainer').appendChild(document.createElement('div'));
            div.className="comment";
            div.innerHTML=ajax.responseText;
            setNewStats();
            return true;
        }
    }
}

function setNewStats()
{
    console.log("in ");
    var params= new FormData();
    var ajax= new XMLHttpRequest();
    ajax.open("POST", "http://localhost:5000/setstats", true);
    ajax.send(params);
    ajax.onload = function() {
        if (ajax.status == 200)
        {
            console.log("inner ");
            var jsonObj=JSON.parse(ajax.responseText)
            setStats(jsonObj["ratings"])
            return true;
        }
    }
}

function initSentimentSection(jsonObj){
    var section=document.querySelector('#sentimentsection');
    clearSentimentSection();
    section.style.display="block";
    var h2=section.appendChild(document.createElement('h2'));
    h2.innerHTML="Sentimental Analysis Result";
    var p=section.appendChild(document.createElement('p'));
    p.innerHTML=jsonObj["review"];
    p.id="reviewtoadd";
    initResultTable(section, jsonObj);
    initResultSectionButtons(section);
}

function initResultTable(section, jsonObj){
    var table=section.appendChild(document.createElement('table'));
    table.setAttribute("align", "center");
    var thead=table.appendChild(document.createElement('thead'));
    var tr=thead.appendChild(document.createElement('tr'));
    var headings=["Method", "Sentiment", "Probability"];
    for(let i=0 ; i<headings.length ; i++)
    {
        var th=tr.appendChild(document.createElement('th'));
        th.innerHTML=headings[i];
    }
    var tbody=table.appendChild(document.createElement('tbody'));
    for(var key in jsonObj)
    {
        if(key.trim()=="review".trim())
            continue;
        tr=tbody.appendChild(document.createElement('tr'));
        var td=tr.appendChild(document.createElement('td'));
        td.innerHTML=key;
        td=tr.appendChild(document.createElement('td'));
        td.innerHTML=jsonObj[key][0];
        td=tr.appendChild(document.createElement('td'));
        td.innerHTML=jsonObj[key][1];
    }
}

function initResultSectionButtons(section)
{
    var div=section.appendChild(document.createElement('div'));
    div.style.margin="0px 22%";
    div.style.textAlign = "center";
    var btns=[["Add to Dataset", "btnAdd"], ["Clear Result", "btnClear"]];
    for(let i=0 ; i<btns.length ; i++)
    {
        var btn=div.appendChild(document.createElement('button'));
        btn.id=btns[i][1];
        btn.innerHTML=btns[i][0];
        btn.style.margin="0px 5%";
    }
    document.getElementById('btnAdd').addEventListener('click', addReview);
    document.getElementById('btnClear').addEventListener('click', clearSentimentSection);
}

function clearSentimentSection(){
    var section=document.querySelector('#sentimentsection');
    section.innerHTML="";
    section.style.display="none";
}

initNav();
initHeader();
initSynopsisSection();