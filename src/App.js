import React from 'react';
import Axios from 'axios';
import './style.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.getCountryData = this.getCountryData.bind(this);
  }
  state = {
    confirmed: 0,
    recovered: 0,
    deaths: 0,
    countries: []
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const resApi = await Axios.get('https://covid19.mathdro.id/api');
    const resCountries = await Axios.get(
      'https://covid19.mathdro.id/api/countries'
    );
    const countries = [];
    for (var i = 0; i < resCountries.data.countries.length; i++) {
      countries.push(resCountries.data.countries[i].name);
    }

    this.setState({
      confirmed: resApi.data.confirmed.value,
      recovered: resApi.data.recovered.value,
      deaths: resApi.data.deaths.value,
      countries
    });
  }

  // Error Management
  async getCountryData(event) {
    try {
      const res = await Axios.get(
        `https://covid19.mathdro.id/api/countries/${event.target.value}`
      );
      this.setState({
        confirmed: res.data.confirmed.value,
        recovered: res.data.recovered.value,
        deaths: res.data.deaths.value
      });
    } catch (err) {
      if (err.response.status === 404)
        this.setState({
          confirmed: 'No data available',
          recovered: 'No data available',
          deaths: 'No data available'
        });
    }
  }

  //function to choose country in the list
  renderCountryOptions() {
    // return this.state.countries.map((name, iso2) => {
    return this.state.countries.map((name, i) => {
      return <option key={name}>{name}</option>;
    });
  }

  render() {
    return (
      <div className="container">
        <h1>COVID19 Update</h1>

        <select
          className="form-select form-select-sm"
          onChange={this.getCountryData}
        >
          {this.renderCountryOptions()}
        </select>

        <div className="container">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Confirmed</h5>
              <p className="card-text">{this.state.confirmed}</p>
            </div>
          </div>

          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Recovered</h5>
              <p className="card-text">{this.state.recovered}</p>
            </div>
          </div>

          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Death:</h5>
              <p className="card-text">{this.state.deaths}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
