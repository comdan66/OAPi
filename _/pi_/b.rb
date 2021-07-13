def execute_each_sec(sleep_sec)
  yield
  sleep sleep_sec
end

5.times do
  execute_each_sec(1) do ||
    puts "CurrentTime:#{Time.now}"
    $stdout.flush
  end
end