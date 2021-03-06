import React, { Component } from 'react';
import {Container, Col, Row, Card, CardBody, Alert, Table, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import Skycons from 'react-skycons';
import {MDBIcon} from 'mdbreact';
import './App.css';

//Laddat ner react-moment som dependency och importerat den för att transformera datum och tid från unix
import Moment from 'react-moment';
//Valt format för datum och tid:
Moment.globalFormat = 'MM/DD HH:mm';

/*hade en enda array från början för all data,
 men för att få tillgång till all data med tanke på att det är objekt och array och objekt i 
 array osv så valde jag att göra en tom array för respektive sak jag vill kunna visa användaren för att lättare
 komma åt innehållet */

class App extends Component {
constructor() {
  super();

  this.state = {
    weather: [],
    currently: [],
    hourly: [],
    daily: [],
 isToggleOn: true

  };

  this.handleClick = this.handleClick.bind(this);
}



/*Jag la i min geolocation i en funktion i min mount eftersom jag sedan sparar ner koordinaterna i respektiva variabel
för att använda dessa i min fetch till API:et, la också till svenska som språk i min request,
efter fetch så väljer jag att göra en setstate för respektive array där jag specifikt väljer vilken data det är jag vill komma åt,
för att inte komplicera livet så vill jag direkt in i arrayerna för daily och hourly så jag sedan bara kan rendera ut den datan i min render funktion*/

componentDidMount() {
 
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
     let longitude = position.coords.longitude;
  fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c3acb99cc725550cc7e45a340e32bd52/${latitude},${longitude}?lang=sv`)
.then(res => res.json())
  .then(data => {

this.setState({ 
  weather: data,
  currently: data['currently'],
  hourly: data['hourly']['data'],
  daily: data['daily']['data']
}) 
})}, (error) => alert(
  `${error.message}, Whoops, couldn't find you. Either your browser doesn't support geolocation or you clicked block. We require the use of geolocation to show you data, so try and click the icon in the right side of your address bar and clearing your settings for future visits, reload the page and click "Allow"`
)


  )}

  handleClick() {
    this.setState(function(prevState) {
        return {isToggleOn: !prevState.isToggleOn};
    });
}
 
/*här uppdaterar jag respektive state till datan jag fetchat från min request och renderar ut
mina html-element i return med innehåll och speciella klasser jag använder från reactstrap och ikoner från mdbreact*/

  render() {

const {weather} = this.state
const {currently} = this.state
const {hourly} = this.state
const {daily} = this.state

    return (


<Container>
<Alert color="primary">
{/* Renderar ut vädret just nu för platsen där jag befinner mig */}
  <h1>Vädret just nu i {weather.timezone} <MDBIcon icon="globe" size="lg" /></h1> 
  <ul> 
    <li>  <Moment unix>{currently.time}</Moment></li>
    <li> {currently.summary}</li>
    <button onClick={this.handleClick}>
          {this.state.isToggleOn ? `${Math.round((currently.temperature  - 32) * (5/9)) + "°C"}` : `${Math.round(currently.temperature) + "°F"}`}
        </button>

<li>{currently.humidity + " %"} </li>
<li>{Math.round((currently.windSpeed)) + " mph"} </li>
</ul>
   </Alert>



{/* Renderar ut vädret för 7 framöver exklusive idag eftersom det visas ovan därav har jag slicat bort idag från min array*/}
<h2>Kortöversikt för veckan</h2>
<ListGroup>
{daily.slice(1).map(day => 
        <ListGroupItem active>
          <ListGroupItemHeading>  <Moment unix>{day.time}</Moment>  </ListGroupItemHeading>
          <ListGroupItemText>



        
          <MDBIcon icon="temperature-high" size="lg"/>     
   <button onClick={this.handleClick}>
          {this.state.isToggleOn ? `${Math.round((day.temperatureHigh  - 32) * (5/9)) + " °C"}` : `${Math.round(day.temperatureLow) + " °F"}`}
        </button>
        
        
         <MDBIcon icon="temperature-low" size="lg"/> 
         <button onClick={this.handleClick}>
          {this.state.isToggleOn ? `${Math.round((day.temperatureLow  - 32) * (5/9)) + " °C"}` : `${Math.round(day.temperatureLow) + " °F"}`}
        </button>
         
         
      <MDBIcon icon ="tint" size="lg"/><MDBIcon icon ="percent" size="lg" /> {day.humidity + "%"} {' '}
 <MDBIcon icon="wind" size="lg"/> {Math.round((day.windSpeed)) + " mph"} {' '}
<MDBIcon icon="sun" size="lg" /> <MDBIcon icon="long-arrow-alt-up" size="lg" /> <Moment unix>{day.sunriseTime}</Moment> {' '}
 <MDBIcon icon="sun" size="lg" /> <MDBIcon icon="long-arrow-alt-down" size="lg" /> <Moment unix>{day.sunsetTime}</Moment> 

          </ListGroupItemText>
        </ListGroupItem>
)}
        </ListGroup>

        {/* Renderar ut vädret för var tredje timme framöver, här filtrerar jag min array för att den ska vissa var tredje timme */}
  <h2>Prognos för var tredje timme</h2>
<Table bordered dark size="sm">
  <thead>
    <tr>
      <th>Datum/Klockslag</th>
      <th>Sammanfattning</th>
      <th>Temperatur</th>
    </tr>
  </thead>
  <tbody>
  {hourly.filter((_,i) => i % 3 === 0).map(h =>
    <tr>
      <td><Moment unix>{h.time}</Moment></td>
      <td>{h.summary}</td>

      <td>
      
      <button onClick={this.handleClick}>
          {this.state.isToggleOn ? `${Math.round((h.temperature  - 32) * (5/9)) + " °C"}` : `${Math.round(h.temperature) + "°F"}`}
        </button>

      </td>
    </tr>
  )}
</tbody>
    </Table>


{/* Renderar ut vädret för fem dagar inklusive idag */}
<h2>5-dagars prognos</h2>
<div>
  <Row> 
  {daily.slice(0,5).map(d => 
    <Col xs="6" sm="4">
  <Card body inverse color="info" style={{borderColor: '#333' }}>
    <CardBody>
  <h3> <Moment unix>{d.time}</Moment> </h3>
<Skycons color='white'
      icon={d.icon.toUpperCase()} 
      autoplay={true}/>
  <ul>



  <li key={d.temperatureHigh}><MDBIcon icon="temperature-high" size="lg"/> 
  <button onClick={this.handleClick}>
          {this.state.isToggleOn ? `${Math.round((d.temperatureHigh  - 32) * (5/9)) + " °C"}` : `${Math.round(d.temperatureHigh) + " °F"}`}
        </button>

    </li>
<li key={d.temperatureLow}><MDBIcon icon="temperature-low" size="lg"/> 

<button onClick={this.handleClick}>
          {this.state.isToggleOn ? `${Math.round((d.temperatureLow  - 32) * (5/9)) + " °C"}` : `${Math.round(d.temperatureLow) + " °F"}`}
        </button>


</li>
 <li key={d.humidity}><MDBIcon icon ="tint" size="lg"/><MDBIcon icon ="percent" size="lg" /> {d.humidity + "%"}</li>
<li key={d.windSpeed}><MDBIcon icon="wind" size="lg"/> {Math.round((d.windSpeed)) + " mph"}</li>
<li> <MDBIcon icon="sun" size="lg" /> <MDBIcon icon="long-arrow-alt-up" size="lg" /> <Moment unix>{d.sunriseTime}</Moment> </li> 
 <li> <MDBIcon icon="sun" size="lg" /> <MDBIcon icon="long-arrow-alt-down" size="lg" /> <Moment unix>{d.sunsetTime}</Moment> </li>
</ul>
</CardBody>
</Card>
</Col>
)}
</Row> 
</div>
</Container>

);
} 
}

export default App;


