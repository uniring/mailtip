# Mailtip

> A jQuery email autocomplete plugin. AngularJS wrapper available.

### Required
> jQuery >= 1.7

### jQuery example
```js
$(function (){
  var info = $('.info');
  
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

### Options
- *mails*
> The email domain list.

- *width*
> The pupup tip's width, if set to ```input``` the tip's width will equal the input's width.

- *onSelected*
> The function to call when an option is selected.

- *offsetTop*
> The tooltip top offset if required, defaults to -1.

- *offsetLeft*
> The tooltip left offset if required, defaults to 0.

- *zIndex*
> The zIndex of the tooltip element, defaults to 10000.

- *maximumVisibleOptions*
> The maximum number of options to display, defaults to 10.

- *disableAutocomplete*
> Disable the browser's autocomplete funcionality, defaults to true.


### Live Demo
[Click here see the live demo](https://uniring.github.io/mailtip/mailtip.html)
