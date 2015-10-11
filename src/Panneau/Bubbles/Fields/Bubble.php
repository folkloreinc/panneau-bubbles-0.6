<?php namespace Panneau\Bubbles\Fields;

use Panneau\Support\Field;

class Bubble extends Field
{
    protected $attributes = array(
        'type' => 'bubble'
    );
    
    protected $relation = 'bubbles';
}
