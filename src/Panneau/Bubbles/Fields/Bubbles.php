<?php namespace Panneau\Bubbles\Fields;

use Panneau\Support\Field;

class Bubbles extends Field
{
    protected $attributes = array(
        'type' => 'bubbles'
    );
    
    protected $hasMany = \Panneau\Bubbles\Fields\Bubble::class;
    
    protected $relationShouldBeDeleted = false;
}
