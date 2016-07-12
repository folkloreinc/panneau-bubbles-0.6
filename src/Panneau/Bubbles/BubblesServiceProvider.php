<?php namespace Panneau\Bubbles;

use Panneau\Panneau;
use Panneau\Support\ServiceProvider;

class BubblesServiceProvider extends ServiceProvider
{
    protected $fields = array(
        'bubble' => \Panneau\Bubbles\Fields\Bubble::class,
        'bubbles' => \Panneau\Bubbles\Fields\Bubbles::class
    );
    
    protected $resources = array(
        'bubbles' => \Panneau\Bubbles\BubblesResource::class
    );
    
    protected $assets = array(
        'typeahead' => 'https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.bundle.min.js',
        'bubbles_css' => 'vendor/panneau-bubbles/css/bubbles.css',
        'bubbles_js' => [
            'src' => 'vendor/panneau-bubbles/js/bubbles.js',
            'dependencies' => ['panneau', 'typeahead']
        ]
    );
    
    public function boot()
    {
        parent::boot();
        
        $migrationsPath = __DIR__.'/../../migrations/';
        $translationsPath = __DIR__.'/../../resources/lang/';
        $assetsPath = __DIR__.'/../../resources/assets/build/';
        $configPath = __DIR__.'/../../config/bubbles.php';
        
        $this->loadTranslationsFrom($translationsPath, 'panneau-bubbles');
        
        $this->mergeConfigFrom($configPath, 'panneau.bubbles');

        $this->publishes([
            $migrationsPath => database_path('migrations')
        ], 'migrations');
        
        $this->publishes([
            $assetsPath => public_path('vendor/panneau-bubbles')
        ], 'assets');
        
        $this->publishes([
            $configPath => config_path('panneau/bubbles.php'),
        ], 'config');
        
        $this->registerBubbleTypes();
    }
    
    protected function registerBubbleTypes()
    {
        $panneau = app('panneau');
        
        $types = config('panneau.bubbles.types');
        foreach($types as $key => $type)
        {
            if(is_numeric($key))
            {
                $panneau->registerBubbleType($type);
            }
            else
            {
                $panneau->registerBubbleType($type, $key);
            }
        }
    }
    
    public function register()
    {
        parent::register();
        
        $this->registerMacro();
    }
    
    protected function registerMacro()
    {
        $app = $this->app;
        Panneau::macro('registerBubbleType', function($class, $key = null) use ($app)
        {
            return $this->register('bubble', $class, $key);
        });
        
        Panneau::macro('bubbleType', function($key, $args = []) use ($app)
        {
            return $this->make('bubble', $key, $args);
        });
        
        Panneau::macro('bubbleTypes', function()
        {
            return $this->getRegister('bubble');
        });
    }
}
