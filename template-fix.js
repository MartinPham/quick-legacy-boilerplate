/**
 * Created by zzz on 11/6/15.
 */

function template_fix_strip_configtext(str)
{
  if(str.indexOf('<!--[') > -1)
  {
    str = str.split(']-->');
    str = str[1].split('<!--[/');
    str = str[0];


    return str;
  }else if(str.indexOf('<!--(') > -1)
  {
    str = str.split(')-->');
    str = str[1].split('<!--(/');
    str = str[0];


    return str;
  }
}


  document.querySelectorAll('a,li,img,title,div,span,section').forEach(function(element){
    try {
      var src = element.innerText;
      if(src.indexOf('<!--[') > -1 || src.indexOf('<!--(') > -1)
      {
        element.innerText = (template_fix_strip_configtext(src));
      }
    }catch (e){}


    try {
      var src = unescape(element.href);
      if(src.indexOf('<!--[') > -1 || src.indexOf('<!--(') > -1)
      {
        element.href = (template_fix_strip_configtext(src));
      }
    }catch (e){}





    try {
      var src = unescape(element.src);
      if(src.indexOf('<!--[') > -1 || src.indexOf('<!--(') > -1)
      {
        element.src = (template_fix_strip_configtext(src));
      }
    }catch (e){console.log(e)}


    try {
      var src = unescape(element.css.backgroundImage);
      if(src.indexOf('<!--[') > -1 || src.indexOf('<!--(') > -1)
      {
        element.css.backgroundImage = ('url("' + template_fix_strip_configtext(src) + '")');
      }
    }catch (e){}

  });
