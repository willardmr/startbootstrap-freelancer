var Cell = React.createClass({
    componentWillMount: function() {
        this.style = {
            width: this.props.percentage + '%',
            height: this.props.percentage + '%',
            left: this.props.row * this.props.percentage + '%',
            top: this.props.col * this.props.percentage + '%',
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.render();
    },
    renderInactive: function() {
        return (
            <div className="note inactive"
                onClick={this.props.onClick}
                style={this.style}>
            </div>
            );
    },
    renderActive: function() {
        return (
            <div className="note active"
                onClick={this.props.onClick}
                style={this.style}>
            </div>
            )
    },
    render: function() {
        if (this.props.alive) {
            return this.renderActive(); }
        else {
            return this.renderInactive();
        }
    }
});

var Board = React.createClass({
    propTypes: {
        count: function(props, propName) {
            if (typeof props[propName] !== "number"){
                return new Error('The count property must be a number');
            }
            if (props[propName] > 100) {
                return new Error("Creating " + props[propName] + " notes is ridiculous");
            }
        }
    },
    getInitialState: function() {
        var playback = null;
        var board = [];
        for (var i=0; i<this.props.count; i++){
            var temp_list = [];
            for (var j=0; j<this.props.count; j++){
                temp_list.push({alive: false, row:i, col:j});
            }
            board.push(temp_list);
        }
        return {
            notes: board
        };
    },
    startPlayback: function() {
        if (this.state.playback == null){
            this.getNextStates();
            var playback = setInterval(this.getNextStates, 1000);
            this.setState({playback: playback});
        }
    },
    pausePlayback: function() {
        if (this.state.playback != null){
            clearInterval(this.state.playback);
            this.setState({playback: null});
        }
    },
    getNextStates: function() {
        var arr = $.extend(true, [], this.state.notes);
        var anyAlive = false;
        for (var i=0; i<arr.length; i++){
            for (var j=0; j<arr[i].length; j++){
                arr[i][j].alive = this.isAlive(arr[i][j]);
                if (arr[i][j].alive == true) {
                    anyAlive = true;
                }
            }
        }
        if (!anyAlive) {
            this.pausePlayback();
        }
        this.setState({notes: arr});
    },
    isAlive: function(note) {
       var neighbors = this.numberOfNeighbors(note);
       if (note.alive) {
            if (neighbors < 2){
                return false;
            }
            if (neighbors == 2 || neighbors == 3){
                return true;
            }
            if (neighbors > 3){
                return false;
            }
       }
       else {
            if (neighbors == 3){
                return true;
            }
       }
    },
    numberOfNeighbors: function(note) {
        var neighbors = 0;
        for (var i=note.row-1; i<=note.row+1; i++){
            for (var j=note.col-1; j<=note.col+1; j++){
                if (i >= 0 && i < this.props.count){
                   if (j >= 0 && j < this.props.count){

                        if (this.state.notes[i][j].alive) {
                             neighbors = neighbors + 1;
                         }
                   }
                }
            }
        }
        if (note.alive) {
            neighbors = neighbors - 1;
        }
        return neighbors
    },
    handleCellClick: function(event, note, thing){
        var arr = this.state.notes;
        event.alive = !event.alive;
        this.setState({notes: arr});
    },
    eachCell: function(note, row, col) {
        var percentage = 100 / this.props.count;
        return (
                <Cell
                    onClick={this.handleCellClick.bind(null, note)}
                    row = {note.row}
                    col = {note.col}
                    alive = {note.alive}
                    percentage = {percentage}
                >{note.note}</Cell>
            );
    },
    eachRow: function(note_list, i, array) {
        return note_list.map(
            (function(x, index) {
                return this.eachCell(x, i, index)
            }).bind(this));
    },
    render: function() {
        return (<div className="board">
                    {this.state.notes.map(this.eachRow)}
                    <button className="game-control pull-right btn btn-sm btn-success glyphicon glyphicon-pause"
                            onClick={this.pausePlayback.bind(null)}/>
                    <button className="game-control pull-right btn btn-sm btn-success glyphicon glyphicon-play"
                            onClick={this.startPlayback.bind(null)}/>
             
            </div>

        );
    }
});


React.render(<Board count={10}/>, 
    document.getElementById('react-container'));
