(function() {
  var Helpers, fs, gutil, hbs, highlighter, marked, path, templateData;

  fs = require('fs');

  path = require('path');

  gutil = require('gulp-util');

  marked = require('marked');

  highlighter = require('highlight.js');

  hbs = new Object();

  templateData = new Object();

  Helpers = (function() {
    function Helpers(handlebars, tplateData) {
      hbs = handlebars;
      templateData = tplateData;
      return {
        template: this.template,
        capitals: this.capitals,
        bodyInsert: this.bodyInsert,
        link: this.link,
        cssInject: this.cssInject,
        jsInject: this.jsInject,
        markdown: this.markdown,
        markdownHere: this.markdownHere,
        image: this.image
      };
    }

    Helpers.prototype.capitals = function(str) {
      return str.toUpperCase();
    };

    Helpers.prototype.bodyInsert = function(mode) {
      var content;
      if (mode !== 'live') {
        content = '<body></body>';
      } else {
        content = '';
      }
      return new hbs.SafeString(content);
    };

    Helpers.prototype.jsInject = function(mode) {
      var content, dir, i, j, len, len1, script, scripts;
      content = new String();
      if (mode === 'live') {
        dir = './build-live/js';
      } else {
        dir = './build-dev/js';
      }
      scripts = fs.readdirSync(dir);
      if (mode !== 'live') {
        content += "<!-- bower:js -->\n\t<!-- endbower -->\n\t";
      }
      for (i = 0, len = scripts.length; i < len; i++) {
        script = scripts[i];
        if (path.extname(script) === '.js') {
          if (mode === 'live' && script !== 'vendor.min.js') {
            content += "<script src=\"http://" + templateData.year + ".igem.org/Template:" + templateData.teamName + "/js/" + script + "?action=raw&type=text/js\"></script>\n\t";
          } else {
            if (script !== 'vendor.min.js') {
              content += "<script src=\"js/" + script + "\"></script>\n\t";
            }
          }
        }
      }
      for (j = 0, len1 = scripts.length; j < len1; j++) {
        script = scripts[j];
        if (script === 'vendor.min.js') {
          content = ("<script src=\"http://" + templateData.year + ".igem.org/Template:" + templateData.teamName + "/js/" + script + "?action=raw&type=text/js\"></script>\n\t") + content;
        }
      }
      return new hbs.SafeString(content);
    };

    Helpers.prototype.cssInject = function(mode) {
      var content, dir, i, j, len, len1, styles, stylesheet;
      content = new String();
      if (mode === 'live') {
        dir = './build-live/css';
      } else {
        dir = './src/styles';
      }
      styles = fs.readdirSync(dir);
      if (mode !== 'live') {
        content += "<!-- bower:css -->\n\t<!-- endbower -->\n\t";
      }
      for (i = 0, len = styles.length; i < len; i++) {
        stylesheet = styles[i];
        if (path.extname(stylesheet) === '.css') {
          if (mode === 'live' && stylesheet !== 'vendor.min.css') {
            content += "<link rel=\"stylesheet\" href=\"http://" + templateData.year + ".igem.org/Template:" + templateData.teamName + "/css/" + stylesheet + "?action=raw&ctype=text/css\" type=\"text/css\" />\n\t";
          } else if (stylesheet !== 'vendor.min.css') {
            content += "<link rel=\"stylesheet\" href=\"styles/" + stylesheet + "\" type=\"text/css\" />\n\t";
          }
        }
      }
      for (j = 0, len1 = styles.length; j < len1; j++) {
        stylesheet = styles[j];
        if (stylesheet === 'vendor.min.css') {
          content = ("<link rel=\"stylesheet\" href=\"http://" + templateData.year + ".igem.org/Template:" + templateData.teamName + "/css/" + stylesheet + "?action=raw&ctype=text/css\" type=\"text/css\" />\n\t") + content;
        }
      }
      return new hbs.SafeString(content);
    };

    Helpers.prototype.image = function(img, format, mode) {
      var content, fmt, imageStores;
      if (mode === 'live') {
        if (format === 'directlink') {
          imageStores = JSON.parse(fs.readFileSync('images.json'));
          content = imageStores[img];
        } else {
          if (format === 'file') {
            fmt = 'File';
          } else if (format === 'media') {
            fmt = 'Media';
          }
          content = "</html> [[" + fmt + ":" + templateData.teamName + "_" + templateData.year + "_" + img + "]] <html>";
        }
      } else {
        if (format !== 'directlink') {
          content = "<img src=\"images/" + img + "\" />";
        } else {
          content = "images/" + img;
        }
      }
      return new hbs.SafeString(content);
    };

    Helpers.prototype.link = function(linkName, mode) {
      if (mode === 'live') {
        if (linkName === 'index') {
          return "http://" + templateData.year + ".igem.org/Team:" + templateData.teamName;
        } else {
          return "http://" + templateData.year + ".igem.org/Team:" + templateData.teamName + "/" + linkName;
        }
      } else {
        if (linkName === 'index') {
          return 'index.html';
        } else {
          return linkName + ".html";
        }
      }
    };

    Helpers.prototype.template = function(templateName, mode) {
      var template;
      template = hbs.compile(fs.readFileSync(__dirname + "/src/templates/" + templateName + ".hbs", 'utf8'));
      if (mode === 'live') {
        if (templateName === 'preamble') {
          return new hbs.SafeString('');
        }
        return new hbs.SafeString("{{" + templateData.teamName + "/" + templateName + "}}");
      } else {
        return new hbs.SafeString(template(templateData));
      }
    };

    Helpers.prototype.markdownHere = function(string, options) {
      var handlebarsedMarkdown, markedHtml;
      marked.setOptions({
        highlight: function(code) {
          return highlighter.highlightAuto(code).value;
        }
      });
      handlebarsedMarkdown = hbs.compile(string)(templateData);
      markedHtml = marked(handlebarsedMarkdown);
      return new hbs.SafeString(markedHtml);
    };

    Helpers.prototype.markdown = function(file) {
      var handlebarsedMarkdown, markdownFile, markedHtml;
      marked.setOptions({
        highlight: function(code) {
          return highlighter.highlightAuto(code).value;
        }
      });
      markdownFile = fs.readFileSync(__dirname + "/src/markdown/" + file + ".md").toString();
      handlebarsedMarkdown = hbs.compile(markdownFile)(templateData);
      markedHtml = marked(handlebarsedMarkdown);
      return new hbs.SafeString(markedHtml);
    };

    return Helpers;

  })();

  module.exports = Helpers;

}).call(this);
