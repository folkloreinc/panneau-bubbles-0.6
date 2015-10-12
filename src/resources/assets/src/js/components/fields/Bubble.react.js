var React = require('react');
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
            titleContent: null
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
            var link = _.get(this.props, 'value.snippet.link', _.get(this.props, 'value.snippet.subtitle'));
            titleContent = (
                <div>
                    <span className="glyphicon glyphicon-file"></span> { title } - <span className="small">{ link }</span>
                </div>
            );
        }
        
        return (
            <div className="form-group form-group-bubble">
                { label }
                <div className="form-group-bubble-item" style={itemStyle}>
                    <div className="row">
                        <div className="title col-sm-8">
                            { titleContent }
                        </div>
                        <div className="col-sm-4 text-right">
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
        var $input = $(React.findDOMNode(this.refs.input));
        
        var bubbles = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: this.props.queryUrl,
                wildcard: this.props.queryWildcard
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
        var $input = $(React.findDOMNode(this.refs.input));
        
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
