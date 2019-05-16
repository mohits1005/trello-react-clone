import React from 'react';
import ContentBody from './ContentBody';
class SelectBoard extends React.Component{
    render(){
        return (
            <div></div>
        )
    }
}
class HomePage extends React.Component {
    state = {
        data: [],
        activeBoardId: 1
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
    render() {
        var { data, activeBoardId} = this.state;
        var activeBoard = this.renderActiveBoard(data, activeBoardId);
        return (
            <div>
                <SelectBoard data={data} setActiveBoard={this.setActiveBoard}/>
                {
                    activeBoardId > 0 && activeBoard
                }
            </div>
        )
    }
}

export default HomePage;
