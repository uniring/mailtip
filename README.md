# Mailtip

> A jQuery email domain autocomplete plugin. This plugin suggests email domains in a dropdown while the user is typing his email so he can select it from the dropdown to improve writring speed and UX.

> An AngularJS wrapper (still requires jQuery) is optionally available, just include the js file, load the `mailtip` module in your AngularJS app and add the `mailtip` attribute to your email fields. You can change Mailtip configurations using the config provider too, see the example below.

### Required
> jQuery >= 1.7


### Live Demo
[Click here see the live demo in jQuery](https://uniring.github.io/mailtip/mailtip.html)  
[Click here see the live demo in AngularJS](https://uniring.github.io/mailtip/mailtip-angular.html)

### jQuery example
```js
$(function (){
  $('#mailtip').mailtip({
    onSelected: function (mail){
      info.text('You choosed email: ' + mail)
    }
  });
});
```

### AnguarJS directive example (jQuery wrapper)
```html
<input type="email" mailtip>
```
You can set a custom domain list like this:
```html
<input type="email" mailtip mailtip-domains="gmail.com,hotmail.com,yahoo.com">
```
Or you can use the provider to set a list of domains globally so your HTML code ends cleaner:
```
angular.module('yourApp', ['mailtip'])
  .config(function (mailtipConfigProvider) {
    mailtipConfigProvider.set('domains', [
      'gmail.com',
      'hotmail.com',
      'aol.com',
      'msn.com',
      'outlook.com',
      'icloud.com',
      'live.com'
    ]);
  });
```

### Options
- *domains*
> The email domain list.

- *width*
> The pupup tip's width, if set to ```input``` the tip's width will equal the input's width.

- *onSelected*
> The function to call when an option is selected.

- *offsetTop*
> The tooltip top offset if required, defaults to -1.

- *offsetLeft*
> The tooltip left offset if required, defaults to 0.

- *offsetWidth*
> The tooltip width offset when using `auto` width, to make manual adjustments if it doesn't fit your design well.

- *zIndex*
> The zIndex of the tooltip element, defaults to 10000.

- *maximumVisibleOptions*
> The maximum number of options to display, defaults to 10.

- *disableAutocomplete*
> Disable the browser's autocomplete funcionality, defaults to true.
