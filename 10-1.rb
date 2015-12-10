input = '3113322113'

output = nil
40.times do |i|
  input.gsub!(/1+|2+|3+/) do |match|
    "#{match.length}#{match[0]}"
  end
  puts format('%2i %i', i + 1, input.length)
end
