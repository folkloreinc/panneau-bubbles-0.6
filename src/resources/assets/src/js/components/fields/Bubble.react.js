var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var _ = require('lodash');
var Immutable = require('immutable');

var BubbleField = React.createClass({
    
    getDefaultProps: function()
    {
        return {
            placeholder: 'Rechercher...',
            queryUrl: '/panneau/bubbles?search=%QUERY',
            queryWildcard: '%QUERY',
            transformResponse: function(response)
            {
                return response;
            },
            suggestionTemplate: [
                '<div>',
                    '<h4><%= _.get(snippet, "title") %></h4>',
                    '<p class="quiet"><%= _.get(snippet, "link", _.get(snippet, "subtitle")) %></p>',
                '</div>'
            ].join('\n'),
            emptyTemplate: [
                '<div class="empty-message">',
                    'Aucun élément trouvé',
                '</div>'
            ].join('\n'),
            titleContent: null,
            identify: function(it)
            {
                return it.id;
            },
            datumTokenizer: function(it)
            {
                return Bloodhound.tokenizers.whitespace(_.get(it, 'snippet.title', it)); 
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
        };
    },
    
    render: function()
    {
        var label;
        if(this.props.label)
        {
            label = <label htmlFor={name} className="control-label">{this.props.label}</label>;
        }
        
        var inputStyle = {};
        var itemStyle = {
            display: 'none'
        };
        if(this.props.value)
        {
            itemStyle.display = 'block';
            inputStyle.display = 'none';
        }
        
        var valueInput = null;
        if(this.props.value)
        {
            valueInput = <input type="hidden" name={this.props.name} value={this.props.value.id} />
        }
        
        var titleContent;
        if(this.props.titleContent)
        {
            titleContent = this.props.titleContent;
        }
        else
        {
            var title = _.get(this.props, 'value.snippet.title', '');
            var subtitle = _.get(this.props, 'value.snippet.subtitle');
            titleContent = (
                <div>
                    <span className="glyphicon glyphicon-file"></span> { title } - <span className="small">{ subtitle }</span>
                </div>
            );
        }
        
        return (
            <div className="form-group form-group-bubble">
                { label }
                <div className="form-group-list-item" style={itemStyle}>
                    <div className="row">
                        <div className="col col-title">
                            { titleContent }
                        </div>
                        <div className="col col-actions">
                            <button type="button" className="btn btn-xs btn-default glyphicon glyphicon-remove" onClick={ this.onClickRemove }></button>
                        </div>
                    </div>
                </div>
                <div style={inputStyle}>
                    <input ref="input" type="text" className="form-control" placeholder={ this.props.placeholder } />
                </div>
                {valueInput}
            </div>
        );
    },
    
    componentDidMount: function()
    {
        var $input = $(ReactDOM.findDOMNode(this.refs.input));
        
        var bubbles = new Bloodhound({
            datumTokenizer: this.props.datumTokenizer,
            queryTokenizer: this.props.queryTokenizer,
            identify: this.props.identify,
            sufficient: 1,
            remote: {
                url: this.props.queryUrl,
                wildcard: this.props.queryWildcard,
                transform: this.props.transformResponse
            }
        });
        
        $input.typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'bubbles',
            source: bubbles,
            limit: Infinity,
            display: function(suggestion)
            {
                return '';
            },
            templates: {
                empty: this.props.emptyTemplate,
                suggestion: _.template(this.props.suggestionTemplate)
            }
        });
        
        $input.on('typeahead:select', this.onTypeaheadSelect);
    },
    
    componentWillUnmount: function()
    {
        var $input = $(ReactDOM.findDOMNode(this.refs.input));
        
        $input.off('typeahead:select');
        $input.typeahead('destroy');
    },
    
    onTypeaheadSelect: function(e, suggestion)
    {
        e.preventDefault();
        
        if(this.props.onChange)
        {
            this.props.onChange(suggestion);
        }
    },
    
    onClickRemove: function(e)
    {
        e.preventDefault();
        
        if(this.props.onChange)
        {
            this.props.onChange(null);
        }
    }
    
});

module.exports = BubbleField;
