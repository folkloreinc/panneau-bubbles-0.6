<?php namespace Panneau\Bubbles\Support\Traits;

use Panneau\Bubbles\Models\Bubble;

trait HasBubbles
{
    /*
     *
     * Relationships
     *
     */
    public function bubbles()
    {
        $morphName = 'bubbleable';
        $key = 'bubble_id';
        $model = config('panneau.bubbles.models.bubble');
        $table = $morphName.'s';
        $query = $this->morphToMany($model, $morphName, $table, null, $key)
                        ->withTimestamps()
                        ->withPivot($morphName.'_position', $morphName.'_order');

        return $query;
    }
}
