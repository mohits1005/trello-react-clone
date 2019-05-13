import React from 'react';
import Board from 'react-trello'
const data = {
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
class ContentBody extends React.Component
{   
    onDataChange = (data) => {
        console.log('data change')
        console.log(data)
    }
    onCardDelete = (data) => {
        console.log('card delete')
        console.log(data)
    }
    onCardAdd = (data) => {
        console.log('card add')
        console.log(data)
    }
    onCardClick = (data) => {
        console.log('card click')
        console.log(data)
    }
    onLaneAdd = (data) => {
        console.log('lane added')
        console.log(data)
    }
    render(){
        return (
            <div>
                <Board data={data}
                    id="EditableBoard1"
                    draggable
                    onDataChange={this.onDataChange}
                    editable
                    onCardDelete={this.onCardDelete}
                    onCardAdd={this.onCardAdd}
                    onCardClick={this.onCardClick}
                    canAddLanes
                    onLaneAdd={this.onLaneAdd}
                />
            </div>
        )
    }  
}

export default ContentBody;
