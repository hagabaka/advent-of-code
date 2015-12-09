require 'digest'
input = 'bgvyzdsv'

result = (0..1/0.0).find do |i|
  Digest::MD5.digest(input + i.to_s(10))[0..3] <= "\x00\x00\x0F"
end
puts result
