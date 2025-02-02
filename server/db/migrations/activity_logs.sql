ALTER TABLE activity_logs 
ADD COLUMN response_time INTEGER,
ADD COLUMN status_code INTEGER,
ADD COLUMN request_data TEXT;

CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);