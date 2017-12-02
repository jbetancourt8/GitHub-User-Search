import React, { Component } from 'react';
import './App.css';

const handleFetchError = error => alert(`${error}`);

const InfoPanel = ({ userInfo }) => {
  if(!userInfo){
    return null;
  }
  return (
    <div className="app-info">
      <img className="app-userInfo-avatar" src={userInfo.avatar_url} alt={""} />

      <div className="app-user">
        <h2>{userInfo.login}</h2>
        <p>Followers: {userInfo.followers}</p>
        <p>Following: {userInfo.following}</p>
      </div>
    </div>
  );
};

const RepoPanel = ({ repos }) => {
  if(!repos){
    return null;
  }
  return (
    <div className="app-repositories">
      <h3>Repositories</h3>
      <RepoList repos={repos} />
    </div>
  )
}

const RepoList = ({ repos }) => {
  return (
    <ul>
      {repos.map(function(items){
        console.log(items)
        return (
          <ul key={items.id} className="app-list">
            <ul><h3>{items.name}</h3></ul>
            <ul><p>{items.description}</p></ul>
            <ul><a href={items.html_url}>URL</a></ul>
            <ul>Stars: {items.stargazers_count}</ul>
            <ul>Forks: {items.forks}</ul>
            <ul>Issues: {items.open_issues_count}</ul>
            <ul>Size: {items.size} KB</ul>
          </ul>
        );
      })} 
    </ul> 
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      userInfo: null,
      repos: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({ submit: true });

    if(this.state.value === ''){
      alert("Error! Try again!");
    }
    else{
      fetch(`https://api.github.com/users/${this.state.value}`)
        .then(results =>{
          if(results.status <= 200 && results.status < 300){
            return Promise.resolve(results.json());
          }
          else{
            var error = new Error(results.statusText || results.status);
            error.results = results;
            return Promise.reject(error);
          }
        }).then(data => {
          this.setState({userInfo: data});
          
          fetch(`https://api.github.com/users/${this.state.value}/repos`)
          .then(results =>{
            if(results.status >= 200 && results.status < 300){
              return Promise.resolve(results.json());
            }
            else{
              var error = new Error(results.statusText || results.status);
              error.results = results;
              return Promise.reject(error);
            }
          }).then(data => {
            this.setState({repos: data});
            console.log(this.state.repos);
          }, handleFetchError)
          .catch(error => {
            this.setState({error: !this.state.error});
            alert("Error! Try again!");
          })
        }, handleFetchError)
        .catch(error => {
          this.setState({error: !this.state.error});
          alert("Error! Try again!");
        })

      
    }

    event.preventDefault();
  }

  render() {
    return (
      <div className="app">
        <header>
          <h1 className="app-title">GitHub Explorer</h1>
        </header>

        <form onSubmit={this.handleSubmit}>
          <input className="app-input" type="text" value={this.state.value} onChange={this.handleChange}/>
          <input type="submit" value="Submit" onChange={this.handleSubmit}/>
        </form>

        <InfoPanel userInfo={this.state.userInfo} />
        <RepoPanel repos={this.state.repos} />
        
      </div>
    );
  }
}

export default App;
