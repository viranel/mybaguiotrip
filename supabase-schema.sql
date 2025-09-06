-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create policies for trips
CREATE POLICY "Users can view own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Create trip_itineraries table
CREATE TABLE IF NOT EXISTS public.trip_itineraries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  day_number INTEGER NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trip_itineraries
ALTER TABLE public.trip_itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies for trip_itineraries
CREATE POLICY "Users can view own trip itineraries" ON public.trip_itineraries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_itineraries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own trip itineraries" ON public.trip_itineraries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_itineraries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own trip itineraries" ON public.trip_itineraries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_itineraries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip itineraries" ON public.trip_itineraries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_itineraries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_itineraries_updated_at
  BEFORE UPDATE ON public.trip_itineraries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();



