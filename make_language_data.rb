#!/usr/bin/env ruby
require 'open-uri'
MAX_REQUESTS_PER_MINUTE = 5
@url_queue = []
@language_counts = Hash.new(0)
@requests_sent = 0

def fetch_github_data(url)
  puts "Fetching #{url}"
  open(url, {'User-Agent' => 'hagabaka/advent-of-code'}) do |response|
    @requests_sent += 1
    if @requests_sent >= MAX_REQUESTS_PER_MINUTE
      puts "Sleeping for a minute"
      sleep 61 
      @requests_sent = 0
    end 

    links = response.meta['link']
    if links
      if next_page = links[/<([^>]+)>; rel="next"/, 1]
        @url_queue.push(next_page)
      end
    end

    body = response.read
    JSON.parse(body)['items'].each do |repo|
      if language = repo['language']
        @language_counts[language] += 1
      end
    end

    unless @url_queue.empty?
      fetch_github_data(@url_queue.shift)
    end
  end
end

require 'json'
data_file = 'data.json'
data = JSON.parse(File.read(data_file))
unless data.instance_of?(Array) 
  abort("Invalid existing data in #{data_file}")
end

require 'set'
github_usernames = Set.new
data.each do |day|
  day['entries'].each do |entry|
    if url = entry['url']
      if username = url[/github\.com\/([^\/]+)$/, 1]
        github_usernames.add(username)
      end
    end
  end
end

MAX_USER_PER_REQUEST = 80
def user_parameters(usernames)
  usernames.map {|username| "+user:#{username}"}.join('')
end
github_usernames.each_slice(MAX_USER_PER_REQUEST) do |usernames|
  fetch_github_data("https://api.github.com/search/repositories?q=advent#{
      user_parameters(usernames)
    }")
end

colors = JSON.parse(File.read('bower_components/github-colors/colors.json'))
source_url = "https://github.com/search?q=advent#{user_parameters(github_usernames)}"
require 'erb'
language_data = {
  sourceUrl: source_url, 
  label: "#{data.first['date']} - #{data.last['date']}",
  data: @language_counts.each_pair.sort_by {|(_, count)| -count}.map do |(language, count)|
    data = {
      name: "<a href='#{source_url}+language:#{ERB::Util.url_encode(language)}'>#{language}</a>",
      y: count,
    }
    if language_color = colors[language]
      data[:color] = language_color['color']
    end
    data
  end
}

File.open('languages.json', 'w') do |file|
  file.write(JSON.pretty_generate(language_data))
end
