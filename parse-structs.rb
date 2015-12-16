def parse_structs(struct_name, *fields)
  struct = Struct.new(struct_name, *fields)
  DATA.read.lines.map do |line|
    integers = line.scan(/-?\d+(?:.\d+)?/).map {|s| Integer(s)}
    integers.length == fields.length or abort "Cannot parse: #{line}"
    struct.new(*integers)
  end
end
