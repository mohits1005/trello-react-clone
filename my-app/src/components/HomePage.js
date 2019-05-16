import React from 'react';
import ContentBody from './ContentBody';
import { boardData } from './SampleData';
import './HomePage.css';

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
        var data = [
            {
                id: 1,
                name: 'Sample board',
                lanes: [
                    {
                        id: 'lane1',
                        title: 'Planned Tasks',
                        label: '2/2',
                        cards: [
                            { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', comments: [{ 'id': 1, 'text': 'voila' }, { 'id': 2, 'text': 'Task is very big' }] },
                            { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1' }, comments: [] }
                        ]
                    },
                    {
                        id: 'lane2',
                        title: 'Completed',
                        label: '0/0',
                        cards: []
                    }
                ]
            }
        ];
        this.setState({data});
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
                                var length = data[k]['lanes'][i]['cards'][j]['comments'].length;
                                data[k]['lanes'][i]['cards'][j]['comments'].push({ id: (length+1), text: text})
                            }
                        }
                    }
                }
            }
        }
        this.setState({ data: data });
    }
    renderActiveBoard = (data, activeBoardId) => {
        var arr = data.filter(board => board.id === activeBoardId);
        if(arr.length > 0){
            return <ContentBody activeBoardId={activeBoardId} data={arr[0]} addComment={this.addComment} />
        }
        return <div></div>
    }
    addBoard = () => {
        var { data } = this.state;
        var board = {};
        board.lanes = boardData.lanes;
        board.id = data.length > 0 ? data.length + 1 : 0;
        board.name = 'Sample board';
        var new_data = [...data,board];
        this.setState({ data: new_data})
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
