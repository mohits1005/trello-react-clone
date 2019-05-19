import React from 'react';
import ContentBody from './ContentBody';
import { boardData } from './SampleData';
import './HomePage.css';
import _ from 'lodash';

class SelectBoard extends React.Component{
    render(){
        var {data} = this.props;
        const boardList = data.map((board) =>
            <div className="board-wrap" key={board.id} onClick={() => this.props.setActiveBoard(board.id)}>
                {board.name+' '}({board.id})
            </div>
        );
        return (
            <div>
                <div className='board-outer-wrap'>
                    <div className='board-wrap board-add' onClick={this.props.addBoard}>
                        +
                    </div>
                    {boardList}
                </div>
                
            </div>
        )
    }
}
class HomePage extends React.Component {
    state = {
        data: [],
        activeBoardId: -1
    }
    componentDidMount(){
        let url = 'http://ec2-13-233-138-163.ap-south-1.compute.amazonaws.com/boards';
        let fetchData = {
            method: 'GET'
        }
        fetch(url, fetchData)
            .then(response => response.json())
            .then((data) => {
                // console.log(data)
                var activeBoardId = -1;
                if (data.boards.length > 0)
                    activeBoardId = data.boards[0]['id'];
                this.setState({ data: data.boards, activeBoardId: activeBoardId });
            });
    }
    setActiveBoard = (id) => {
        this.setState({ activeBoardId: id });
    }
    addComment = (new_data) => {
        var { cardId, laneId, boardId, text } = new_data;
        var { data } = this.state;
        for (var k = 0; k < data.length; k++) {
            if (data[k]['id'] === boardId){
                for (var i = 0; i < data[k]['lanes'].length; i++) {
                    if (data[k]['lanes'][i]['id'] === laneId) {
                        for (var j = 0; j < data[k]['lanes'][i]['cards'].length; j++) {
                            if (data[k]['lanes'][i]['cards'][j]['id'] === cardId) {
                                let length = 0;
                                if (data[k]['lanes'][i]['cards'][j]['comments'] != undefined && data[k]['lanes'][i]['cards'][j]['comments'].length > 0)
                                {
                                    length = data[k]['lanes'][i]['cards'][j]['comments'].length;
                                    data[k]['lanes'][i]['cards'][j]['comments'].push({ id: (length+1), text: text})
                                }
                                else
                                {
                                    data[k]['lanes'][i]['cards'][j]['comments'] = [];
                                    data[k]['lanes'][i]['cards'][j]['comments'].push({ id: (length + 1), text: text })
                                }
                                let url = 'http://ec2-13-233-138-163.ap-south-1.compute.amazonaws.com/boards/' + boardId;
                                let dataBody = { lanes: data[k]['lanes'] }
                                let headers = {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                                let fetchData = {
                                    method: 'POST',
                                    body: JSON.stringify(dataBody),
                                    headers: headers
                                }
                                fetch(url, fetchData)
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }
                        }
                        
                        
                    }
                }
            }
        }
        this.setState({ data: data });
    }
    updateBoard = (newData, boardId) => {
        // this.setState({data})
        var { data } = this.state;
        for (var k = 0; k < data.length; k++) {
            if (data[k]['id'] === boardId) {
                if (_.isEqual(data[k]['lanes'], newData.lanes))
                {}
                else
                {
                    console.log(boardId)
                    console.log(data)
                    this.setState({ data })
                    let url = 'http://ec2-13-233-138-163.ap-south-1.compute.amazonaws.com/boards/' + boardId;
                    let dataBody = { lanes: newData.lanes }
                    let headers = {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                    let fetchData = {
                        method: 'POST',
                        body: JSON.stringify(dataBody),
                        headers: headers
                    }
                    fetch(url, fetchData)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
            }
        }
    }
    renderActiveBoard = (data, activeBoardId) => {
        var arr = data.filter(board => board.id === activeBoardId);
        if(arr.length > 0){
            return <ContentBody activeBoardId={activeBoardId} data={arr[0]} addComment={this.addComment} updateBoard={this.updateBoard}/>
        }
        return <div></div>
    }
    addBoard = () => {
        var { data } = this.state;
        var board = {};
        board.lanes = boardData.lanes;
        board.id = data.length > 0 ? (data[data.length-1]['id'] + 1) : 0;
        board.name = 'Sample board';
        var new_data = [...data,board];
        let url = 'http://ec2-13-233-138-163.ap-south-1.compute.amazonaws.com/boards';
        let dataBody = { board }
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        let fetchData = {
            method: 'POST',
            body: JSON.stringify(dataBody),
            headers: headers
        }
        fetch(url, fetchData)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                this.setState({ data: new_data, activeBoardId: board.id })
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        var { data, activeBoardId} = this.state;
        var activeBoard = this.renderActiveBoard(data, activeBoardId);
        return (
            <div>
                <SelectBoard data={data} setActiveBoard={this.setActiveBoard} addBoard={this.addBoard}/>
                {
                    activeBoardId > 0 && activeBoard
                }
            </div>
        )
    }
}

export default HomePage;
