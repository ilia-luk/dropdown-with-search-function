import React, { Component, createRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import './Dropdown.css';


class Dropdown extends Component{
  constructor(props){
    super(props)
    this.textInput = createRef();
    this.state = {
      listOpen: false,
      placeholder: this.props.placeholder,
      filtered: [],
      showTimes: false
    }
    this.close = this.close.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }

  componentDidUpdate(){
    if (this.state.filtered.length <= 0) {
      this.setState({
        filtered: this.props.list
      });
    }
  }

  close(){
    this.textInput.current.focus();
    this.setState({
      listOpen: false
    });
  }

  selectItem(title, id, stateKey){
    this.textInput.current.value = title;
    this.textInput.current.focus();
    this.setState({
      listOpen: false,
      showTimes: true
    })
  }

  toggleList(){
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  handleChange(e) {
    let currentList = [];
    let newList = [];
    const currentValue = e.target.value;
    if (currentValue !== "") {
      currentList = this.props.list;
      newList = currentList.filter(item => {
        const lc = item.title.toLowerCase();
        const filter = currentValue.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newList = this.props.list;
    }
    this.setState({
      filtered: newList,
      showTimes: currentValue.length > 0 ? true : false
    });
  }

  clearSearch() {
    this.textInput.current.value = '';
    this.setState({
      filtered: [],
      showTimes: false
    });
  }

  render(){
    const{listOpen, placeholder, filtered, showTimes} = this.state
    return(
      <div className="dd-wrapper">
        <div className="dd-header" onClick={this.toggleList}>
          <input
            type="text"
            className="input"
            onChange={this.handleChange}
            ref={this.textInput}
            placeholder={placeholder} />
          {showTimes ? <FontAwesomeIcon onClick={this.clearSearch}icon={faTimes} /> : null}
          {listOpen
            ? <FontAwesomeIcon icon={faAngleUp} />
            : <FontAwesomeIcon icon={faAngleDown} />
          }
        </div>
        {listOpen && <ul className="dd-list" onClick={e => e.stopPropagation()}>
          {filtered.map((item)=> (
            <li
              className="dd-list-item"
              key={item.id} onClick={() => this.selectItem(item.title, item.id, item.key)}>
                {item.title} {item.selected && <FontAwesomeIcon icon={faCheck} />}
            </li>

          ))}
          <li
            className="dd-list-item"
            key={filtered.length + 1} onClick={this.close}>
              <button>Cancel</button>
          </li>
        </ul>}
      </div>
    )
  }
}

export default Dropdown