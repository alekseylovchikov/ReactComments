var ref = new Firebase('https://glaring-torch-5458.firebaseio.com/glaring-torch-5458/');

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
                        <h3 className="panel-title">{this.props.author}</h3>
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
                <Comment author={comment.author}>
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

        this.props.onCommentSubmit({author: author, text: text});

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
            url: 'https://glaring-torch-5458.firebaseio.com/glaring-torch-5458/comments/',
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
        var comments = ref.child('comments');

        comments.push({
            author: comment.author,
            text: comment.text
        });
    },
    getInitialState: function() {
        //ref.on("value", function(snapshot) {
        //    console.log(snapshot.val());
        //}, function (errorObject) {
        //    console.log("The read failed: " + errorObject.code);
        //});

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

ReactDOM.render(<CommentBox pollInterval={2000} />, document.getElementById('content'));