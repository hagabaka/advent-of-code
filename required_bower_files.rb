#!/usr/bin/env ruby
File.read('config.js').scan(/"(bower_components\/[^"]+)"/) do |(path)|
  puts "git add '#{path}.js'"
end
