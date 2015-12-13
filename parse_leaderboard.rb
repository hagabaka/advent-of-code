#!/usr/bin/env ruby

require 'json'

data_file = 'data.json'
data = JSON.parse(File.read(data_file), symbolize_names: true)
unless data.instance_of?(Array) 
  abort("Invalid existing data in #{data_file}")
end

require 'oga'
require 'open-uri'

document = Oga.parse_html(open('http://adventofcode.com/leaderboard').read.force_encoding('utf-8'))
day = {
  date: document.at_css('.leaderboard-time').text[/Dec \d\d/, 0],
  entries: []
}
data.delete_if do |past_day|
  if past_day[:date] == day[:date]
    warn "Overwriting all existing data for #{past_day[:date]}"
    true
  end
end

document.css('.leaderboard-entry').each do |entry|
  link = entry.at_css('a[target]')
  url = link && link.attr('href').value

  img = entry.at_css('img')
  avatar = img && img.attr('src').value

  anon = entry.at_css('.leaderboard-anon')
  name = link && link.text_nodes.last.text || anon && anon.text || entry.text_nodes.last.text

  label = name
  if img
    label = "<img class='avatar' src='#{avatar}'> #{label}"
  end
  if url
    label = "<a href='#{url}'>#{label}</a>"
  end
  day[:entries] << {
    rank: entry.at_css('.leaderboard-position').text[/\d+/, 0],
    time: entry.at_css('.leaderboard-time').text[/\d\d:\d\d:\d\d/, 0],
    url: url,
    avatar: avatar,
    name: name,
    label: label
  }
end

if day[:entries].empty?
  abort 'Failed to parse any entries'
end
data << day

File.open(data_file, 'w') do |file|
  file.write(JSON.pretty_generate(data))
end
