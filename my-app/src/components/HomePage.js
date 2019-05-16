import React from 'react';
import ContentBody from './ContentBody';
import { boardData } from './SampleData';
class SelectBoard extends React.Component{
    addBoard = () => {
        var { data } = this.props;
        var board = boardData;
        board.id = data.length + 1;
        board.name = 'Sample board';
        this.props.addBoard(board);
    }
    render(){
        var {data} = this.props;
        const boardList = data.map((board) =>
            <div key={board.id} onClick={() => this.props.setActiveBoard(board.id)}>
                {board.id}
                {board.name}
            </div>
        );
        return (
            <div>
                <div>
                    {boardList}
                </div>
                <div onClick onClick={this.addBoard}>
                    Add Board
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
                            { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins' },
                            { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1' } }
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
    renderActiveBoard = (data, activeBoardId) => {
        var arr = data.filter(board => board.id === activeBoardId);
        if(arr.length > 0){
            return <ContentBody data={arr[0]} />
        }
        return <div></div>
    }
    addBoard = (board) => {
        var { data } = this.state;
        data.push(board);
        this.setState({ data });
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
