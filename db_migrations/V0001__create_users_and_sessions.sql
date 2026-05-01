CREATE TABLE IF NOT EXISTS t_p20843780_internet_radio_proje.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  favorite_genre VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p20843780_internet_radio_proje.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p20843780_internet_radio_proje.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p20843780_internet_radio_proje.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p20843780_internet_radio_proje.sessions(user_id);
