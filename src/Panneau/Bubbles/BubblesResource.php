<?php namespace Panneau\Bubbles;

use Panneau\Support\EloquentResource;

class BubblesResource extends EloquentResource
{
    protected $modelName = '\Panneau\Bubbles\Models\Bubble';
    
    
    
    protected function saveModel($model, $data)
    {
        $model->fill($data);
        $model->save();
        
        if(isset($data['fields']))
        {
            $model->saveFields($data['fields']);
        }
        
        return $model;
    }
}
