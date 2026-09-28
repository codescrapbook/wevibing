module WeVibing
  # Ensure stream documents have a 'date' field for unified sorting
  class StreamsDateAlias < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      streams = site.collections['streams']
      return unless streams

      streams.docs.each do |doc|
        stream_date = doc.data['stream_date']
        # If no explicit stream_date, try to infer from filename date if present
        if stream_date.nil?
          # Jekyll parses date-like filenames into 'date' for posts only; emulate for streams
          inferred = infer_date_from_path(doc.relative_path)
          doc.data['date'] ||= inferred if inferred
        else
          doc.data['date'] ||= stream_date
        end
      end
    end

    private

    def infer_date_from_path(path)
      # Match YYYY-MM-DD- prefix
      if path =~ /(?:^|\/)(\d{4})-(\d{2})-(\d{2})-/
        y, m, d = Regexp.last_match.captures
        Time.utc(y.to_i, m.to_i, d.to_i)
      end
    end
  end
end

