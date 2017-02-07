import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import axios from 'axios';
import './CodeEditor.scss';
import 'codemirror/lib/codemirror.css'
// require('codemirror/theme/solarized.css');
require('codemirror/mode/javascript/javascript');
require('codemirror/theme/base16-dark.css');

class CodeEditor extends Component {
  constructor() {
    super();
    this.state = {
      code: '',
      results: '',
      // timeRemaining: 60,
      // prevTime: null,
      timeElapsed: 0,
      startingTime: null,
      playerProgress: [0, 0],
      playerNumber: 0,
      numberOfQuestions: 2
    }
    this.updateCode = this.updateCode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    // this.tick();

    // update playerNumber here using sockets
    // this is dummy code for now
    const startingTime = Date.now();
    this.setState({
      playerNumber: 1,
      startingTime: startingTime
    })
  }
  // when component mounts can you save the start time
  // then when you submit, send the difference?

  // put socket.on in handleSubmit? will this work?

  // componentDidUpdate(){
    // this.tick();
  // }

  // tick(){
  //   setTimeout(() => {
  //     var currentTime = Date.now();
  //     var dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0;
  //     var timeRemaining = Math.max(this.state.timeRemaining - dt/1000, 0);
  //     this.setState({
  //       timeRemaining: timeRemaining,
  //       prevTime: currentTime
  //     });
  //   }, 1000);
  // }


  updateCode(newCode) {
    this.setState ({
      code: newCode
    });
  }

  handleSubmit() {
    // console.log('handleSubmit works if this shows your code', this.state.code);
    const startingTime = this.state.startingTime;
    const playerNumber = this.state.playerNumber;
    const playerProgress = this.state.playerProgress;

    axios.post('/api/code', {
      code: this.state.code,
      timeElapsed: (Date.now() - startingTime)/1000,
      // use playerNumber in playerProgress array
      // to figure out where you are in tests
      playerNumber: this.state.playerNumber,
      playerProgress: this.state.playerProgress
    })
    .then(response => {
      this.setState({results: response.data});
      // console.log("response from running code: ", response.data );
      // console.log('saved successfully');

      if(response.data.indexOf('failing') === -1){
        console.log('emitting correct response from front-end')
        socket.emit('correct response', {
          playerNumber: this.state.playerNumber,
          playerProgress: this.state.playerProgress
        });
        socket.on('update progress', (playerProgress) => {
          this.setState({
            playerProgress: playerProgress
          })
        })

        // check if game is won

        // console.log(playerProgress[playerNumber -1],this.state.numberOfQuestions - 1);
        if (playerProgress[playerNumber - 1] === this.state.numberOfQuestions - 1){
          console.log(playerNumber + " won!");
        }

        // want to leave game if you solved final question correctly
        // socket.on('disconnect', function(){
        //   console.log('socket id ' + socket.id + ' has disconnected. : (');
        // })
      }

    })

  }
  render() {
    var options = {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'base16-dark',
      tabSize: 2,
      lineWrapping: true,
      showCursorWhenSelecting: true
    };
    var optionsForAnswers = {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'base16-dark',
      tabSize: 2,
      lineWrapping: true,
      showCursorWhenSelecting: true,
      readOnly: true
    };
    return (
    <div id="code-editor-text" className="container">
      <div className="row">
        <div className="col-xs-12">
          <div className="playerProgress" style={{color: "#777"}}>
            <div>
              {this.state.playerProgress.join('-')}
            </div>
          </div>
          <div id="enterCodeText"style={{color:"#777"}}>Enter Code
          </div>
          <CodeMirror
                value={this.state.code}
                onChange={this.updateCode}
                options={options}
          />
          <button id="submit-btn" className="btn btn-primary btn-small" onClick={this.handleSubmit}>SUBMIT</button>

        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <div id="enterCodeText"style={{color:"#777"}}>
            Answer
          </div>
          <CodeMirror
                value={this.state.results}
                options={optionsForAnswers}
          />
        </div>
      </div>
    </div>
    );
  }
}

export default CodeEditor


//       <div id="code-editor-text">
//         <div className="container">
//           <div className="row">
//             <div className="col-xs-12 col-md-8 col-md-offset-2" id="code-offset">
//               <div className="playerProgress" style={{color: "#777"}}>
//                   <div>
//                     {this.state.playerProgress.join('-')}
//                   </div>
//               </div>
//               <div id="enterCodeText"style={{color:"#777"}}>Enter Code
//               </div>
//               <CodeMirror
//                 value={this.state.code}
//                 onChange={this.updateCode}
//                 options={options}
//               />
//               <button id="submit-btn" className="btn btn-primary btn-small" onClick={this.handleSubmit}>SUBMIT</button>
//               <div id="enterCodeText"style={{color:"#777"}}>
//                 Answer
//               </div>
//               <CodeMirror
//                 value={this.state.results}
//                 options={optionsForAnswers}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
