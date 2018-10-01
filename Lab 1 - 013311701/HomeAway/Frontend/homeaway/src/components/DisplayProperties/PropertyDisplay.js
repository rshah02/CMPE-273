import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Header from '../Header/Header';
import axios from 'axios';

class PropertyDisplay extends Component {

    constructor() {
        super();

        this.state = {
            arrivalDate: moment(),
            departureDate: moment(),
            propertyDetails: {},
            bookingStartDate: "",
            bokingEndDate: "",
            guests: 2,
            totalCost: 0
        }

        //Bind
        this.submitBooking = this.submitBooking.bind(this);
        this.handleArrivalDateChange = this.handleArrivalDateChange.bind(this);
        this.handleDepartureDateChange = this.handleDepartureDateChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        axios.defaults.withCredentials = true;

        var data = {
            PropertyId: this.props.match.params.id
        }
        console.log('Data: ', data);
        axios.post('http://localhost:3001/property-details', data)
            .then(response => {
                if (response.status === 200) {
                    console.log('Result: ', response.data);
                    this.setState({
                        propertyDetails: response.data
                    });                    
                }
            });
    }

    submitBooking = (e) => {

        axios.defaults.withCredentials = true;
        var data = {
            PropertyId: this.props.match.params.id,
            Bookingstartdate: this.state.bookingStartDate,
            Bookingenddate: this.state.bookingEndDate,
            Guests: this.state.guests,
            Totalcost: e.target.value
        }
         
        axios.post('http://localhost:3001/submit-booking', data)
            .then( response=>{
                if(response.status === 200){
                    console.log('Booking Successful!');
                }
            });

    }

    handleArrivalDateChange(date) {

        var month = date.toString().split(' ')[1];
        var day = date.toString().split(' ')[2];

        this.setState({
            arrivalDate: date,
            bookingStartDate: month + ' ' + day
        });
    }

    handleDepartureDateChange(date) {

        var month = date.toString().split(' ')[1];
        var day = date.toString().split(' ')[2];

        this.setState({
            departureDate: date,
            bookingEndDate: month + ' ' + day
        });
    }

    handleInputChange = (event) => {

        const target = event.target;
        const name = target.name;
        const value = target.value;


        this.setState({
            [name]: value
        });
    }

    render() {
        let redrirectVar = null;
        if (!cookie.load('cookie')) {
            redrirectVar = <Redirect to="/login" />
        }

        var totalCost = 0;

                    if (this.state.propertyDetails.Baserate) {


                        const startDate = moment(this.state.arrivalDate);
                        const timeEnd = moment(this.state.departureDate);
                        const diff = timeEnd.diff(startDate);
                        const diffDuration = moment.duration(diff);
                        //console.log(diffDuration._data.days * this.state.propertyDetails.Baserate.substring(1));
                        totalCost = (diffDuration._data.days + 1) * this.state.propertyDetails.Baserate.substring(1);

                    }



        return (
            <div>
                <Header />
                {redrirectVar}
                <div className="form-group row search-tab container search-tab-display-property">

                    <span className="col-lg-4 col-md-12 col-sm-12 col-xs-12 pad-bot-10">
                        <input type="textbox" className="form-control form-control-lg" placeholder="Search"></input>
                    </span>
                    <span className="col-lg-2 col-md-3 col-sm-4 col-xs-4 pad-bot-10">
                        <DatePicker className="form-control form-control-lg" dateFormat="MM/DD/YY" selected={this.state.arrivalDate} onChange={this.handleArrivalDateChange} />
                    </span>
                    <span className="col-lg-2 col-md-3 col-sm-4 col-xs-4 pad-bot-10">
                        <DatePicker className="form-control form-control-lg" dateFormat="MM/DD/YY" selected={this.state.departureDate} onChange={this.handleDepartureDateChange} />
                    </span>
                    <span className="col-lg-2 col-md-3 col-sm-4 col-xs-4 pad-bot-10">
                        <input type="textbox" className="form-control form-control-lg" placeholder="2 guests" name="guests" onChange={this.handleInputChange}></input>
                    </span>
                    <span className="col-lg-2 col-md-3 col-sm-12 col-xs-12 pad-bot-10">
                        <a href="/display-properties" className="btn btn-primry btn-lg" style={{ width: "100%" }}>Search</a>
                    </span>
                </div>
                <div className=" container property-display-content border">
                    <div className="row">
                        <div className="property-display-img-content col-6">
                            <img className="property-display-img" src="https://odis.homeaway.com/odis/listing/2d64bce1-3b15-4171-8f2f-ae6558097d1c.c10.jpg" alt="property-image" />
                        </div>
                        <div className="property-display-pricing-content col-5 border">
                            <div className="display-price">
                                <h4><strong>{this.state.propertyDetails.Baserate}</strong></h4><span> per night</span>
                            </div>
                            <div>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td><div>Arrive</div><div className="blue-text">{this.state.bookingStartDate}</div></td>
                                            <td><div>Depart</div><div className="blue-text">{this.state.bookingEndDate}</div></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"><div>Guests</div><div className="blue-text">{this.state.guests} guests</div></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div>
                                    <span className="pull-left">Total</span>
                                    <span className="flt-right">${totalCost}</span>
                                </div>
                                <div className="center-content">
                                    <button className="btn btn-lg btn-primary book-btn" onClick={this.submitBooking} value={totalCost}>Book now</button>
                                </div>
                                <hr />
                                <div className="center-content">
                                    <label htmlFor="ownername">Property Owner: </label>
                                    <span id="ownername"><strong> {this.state.propertyDetails.Ownername}</strong></span>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="property-display-details-content col-6">
                            <div className="details-content-headline-text"><h4><strong>{this.state.propertyDetails.Headline}</strong></h4></div>
                            <div>
                                <p>{this.state.propertyDetails.Streetaddress}</p>
                            </div>
                            <div className="details-table">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Details</th>
                                            <th scope="col">Information</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Property type</td>
                                            <td>{this.state.propertyDetails.Propertytype}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Bedrooms</td>
                                            <td>{this.state.propertyDetails.Bedrooms}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">3</th>
                                            <td>Sleeps</td>
                                            <td>{this.state.propertyDetails.Accomodates}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">4</th>
                                            <td>Bathrooms</td>
                                            <td>{this.state.propertyDetails.Bathrooms}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">5</th>
                                            <td>Min Stay</td>
                                            <td>{this.state.propertyDetails.Minstay} nights</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="property-description-content">
                                <h3><strong>{this.state.propertyDetails.Bedrooms} bedroom {this.state.propertyDetails.Bathrooms} bath</strong></h3>
                                <div className="desc-content">
                                    {this.state.propertyDetails.Description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PropertyDisplay;