var Comment = React.createClass({
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },
    render: function() {
        return (
            <div className="comments col-md-12">
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.author} <span className="pull-right">{this.props.time}</span></h3>
                    </div>
                    <div className="panel-body">
                        <span dangerouslySetInnerHTML={this.rawMarkup()} />
                    </div>
                </div>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var comments = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} time={comment.time}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="commentList row">
                {comments}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.refs.author.value.trim();
        var text = this.refs.text.value.trim();
        if (!text || !author) {
            return;
        }
        // TODO: send request to the server
        this.firebaseRef = new Firebase("https://glaring-torch-5458.firebaseio.com/glaring-torch-5458/");
        this.firebaseRef.push({
            author: author,
            text: text
        });
        // TODO: send request to the server
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
    },
    render: function() {
        return (
            <div className="commentForm">
                <form className="commentForm" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <input className="form-control" type="text" ref="author" placeholder="Your name" />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" type="text" ref="text" placeholder="Say something..." />
                        </div>
                        <div className="col-md-12">
                            <hr />
                            <input className="btn btn-success" type="submit" value="Post" />
                            <hr />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        // TODO: submit to the server and refresh the list
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1 className="text-center">React Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

ReactDOM.render(<CommentBox url="/api/comments" pollInterval={2000} />, document.getElementById('content'));