import React, { Component } from 'react';
import Dropdown from './components/Dropdown';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      loading: true,
      data: []
    }
  }

  toggleSelected = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp[id].selected = !temp[id].selected
    this.setState({
      [key]: temp
    })
  }

  resetThenSet = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp.forEach(item => item.selected = false);
    temp[id].selected = true;
    this.setState({
      [key]: temp
    })
  }

  fetchData = () => {
    const id = 'QnVzaW5lc3NOb2RlOmI0OTllOGVlLTliZWUtNGE5NC1iNGJjLTZkZmRkNzI5ZTFkYQ==';
    this.setState({ loading: true }, () => {
      fetch('http://web-backend-dev.zeitgold.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query SomeQuery($id: ID!) {
              business(id: $id) {
                id
                name
              }
              businesses {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              businessSupplier(id: $id) {
                name
                id
              }
            }
          `,
          variables: {
            id
          },
        }),
      })
        .then(response => {
          return response.json()
        })
        .then(responseAsJson => {
          const parsedData = responseAsJson.data.businesses.edges.map(({node}) => {
            const {id, name} = node;
            return {
              id: id,
              title: name,
              selected: false,
              key: 'business'
            }
          })
          this.setState({ loading: false, data: parsedData })
        })
    })
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className="App">
        <p>Most cryptic excerise ever created:</p>

        <div className="wrapper">
        {this.state.data.length > 0 ? (
          <Dropdown
            placeholder="Select business supplier"
            list={this.state.data}
            resetThenSet={this.resetThenSet}
          />
        ) : null}
        </div>
      </div>
    );
  }
}

export default App;
