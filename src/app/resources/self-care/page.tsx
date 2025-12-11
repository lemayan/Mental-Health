import Link from 'next/link';
import { ArrowLeft, Heart, Brain, Users, Sparkles, Moon, Activity, AlertCircle, Phone } from 'lucide-react';

export default function SelfCarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link 
            href="/resources" 
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Link>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Self-Care for Mental Health
              </h1>
            </div>
            <p className="text-xl text-blue-100">
              Simple strategies to prioritize your well-being and build resilience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* What is Self-Care Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Self-Care?</h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                Self-care is any activity or routine that focuses on your health and wellbeing. 
                It isn't limited to spa days or luxurious getaways—it involves the more fundamental 
                steps of caring for your physical, mental, and emotional needs.
              </p>
              <p className="mt-4">
                Anything from getting enough rest to socializing with loved ones or eating well can 
                be considered self-care. Self-care doesn't have to look the same for each person—the 
                ways you care for yourself may differ from those around you, depending on your specific needs.
              </p>
              <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                <p className="text-amber-900 font-medium">
                  ⚠️ Many of us fail to notice how damaging neglecting our self-care can be. It can 
                  lead to rising stress levels, emotional exhaustion, and burnout—taking a heavy toll 
                  on your health, relationships, work, and overall quality of life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Self-Care */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Self-Care</h2>
          
          <div className="grid gap-6">
            {/* Physical Self-Care */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <Activity className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Physical Self-Care</h3>
                  <p className="text-gray-700 mb-3">
                    Physical self-care involves activities that strengthen or restore well-being to your body.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span><strong>Sleep:</strong> Getting enough quality sleep improves decision-making, learning, emotional regulation, and focus</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span><strong>Exercise:</strong> Physical activity releases endorphins that elevate mood and decrease depression, stress, and anxiety</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span><strong>Nutrition:</strong> Eating foods with omega-3s or probiotics may improve mood, while sugary treats and ultra-processed foods can negatively affect physical and emotional health</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Emotional Self-Care */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Emotional Self-Care</h3>
                  <p className="text-gray-700 mb-3">
                    Emotional self-care includes steps to build emotional awareness and learn to better recognize and manage your emotions.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span><strong>Journaling:</strong> Helps you reflect on experiences and process emotions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span><strong>Meditation:</strong> Builds mindfulness and emotional acceptance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span><strong>Therapy:</strong> Provides professional support to heal from trauma and develop coping strategies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span><strong>Emotional Acceptance:</strong> Learning that all emotions are temporary and valid, even the uncomfortable ones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mental & Intellectual Self-Care */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <Brain className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mental & Intellectual Self-Care</h3>
                  <p className="text-gray-700 mb-3">
                    Mental self-care includes activities that improve psychological well-being or keep you mentally sharp.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span><strong>Stress Management:</strong> Techniques like meditation, deep breathing, and mindfulness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span><strong>Creative Pursuits:</strong> Drawing, painting, music, or other artistic activities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span><strong>Learning:</strong> Taking classes, reading, or engaging with topics that interest you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span><strong>Pet Time:</strong> Spending time with beloved pets reduces stress and anxiety</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Self-Care */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Social Self-Care</h3>
                  <p className="text-gray-700 mb-3">
                    Social self-care involves fostering a sense of belonging with others. Unrelenting isolation and 
                    loneliness can take a toll on mental health and weaken your immune system.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Nurture Relationships:</strong> Maintain friendships, family bonds, and romantic relationships</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Make New Connections:</strong> Join clubs, groups, or classes that align with your interests</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Volunteer Work:</strong> Serving others cultivates belonging and purpose</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Group Activities:</strong> Sports teams, walking groups, or hobby clubs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Spiritual Self-Care */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Spiritual Self-Care</h3>
                  <p className="text-gray-700 mb-3">
                    Spiritual self-care involves connecting with something bigger than yourself or looking inward 
                    for wisdom and understanding.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Prayer or Meditation:</strong> Strengthens sense of security and resilience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Religious Services:</strong> Creates sense of belonging and community</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Nature Connection:</strong> Spending time outdoors brings inner peace</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Reflection Practices:</strong> Reading scriptures, contemplation, or journaling</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Self-Care on Mental Health</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Less Stress</h3>
                    <p className="text-gray-700 text-sm">
                      Making time for yourself decreases overall stress and helps you feel rejuvenated
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Better Self-Awareness</h3>
                    <p className="text-gray-700 text-sm">
                      Self-reflection activities allow you to explore your needs, motives, and behavior patterns
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <Moon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Decreased Risk of Burnout</h3>
                    <p className="text-gray-700 text-sm">
                      Self-care practices help maintain a healthier work-life balance and increase job satisfaction
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-100 rounded-full p-2 flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Improved Mood & Focus</h3>
                    <p className="text-gray-700 text-sm">
                      Healthy habits like adequate sleep improve mood, focus, and productivity
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 rounded-full p-2 flex-shrink-0">
                    <Heart className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Increased Self-Esteem</h3>
                    <p className="text-gray-700 text-sm">
                      Treating your body well and practicing self-compassion boosts confidence and body image
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Longer, Healthier Life</h3>
                    <p className="text-gray-700 text-sm">
                      Regular self-care leads to fewer physical health issues and an improved sense of overall well-being
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Self-Care Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Practical Self-Care Strategies</h2>
          
          <div className="space-y-6">
            {/* Tip 1 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Build a Personalized Self-Care Plan</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <div>
                    <strong>Assess Your Needs:</strong> Consider current issues or areas you've been neglecting. 
                    Do you need more exercise, better stress management, or spiritual practices?
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <div>
                    <strong>Set Specific Goals:</strong> Create goals for the day, week, or month. Include the 
                    activity, time, and location. Example: "30 minutes of jogging on Monday mornings" or "one hour 
                    of meal prep on Sunday nights"
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <div>
                    <strong>Gather Resources:</strong> Collect recipes, instructional videos, wellness apps, or 
                    whatever tools you need. Use alarms, calendars, or planning tools to stay on track
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <div>
                    <strong>Seek Professional Guidance:</strong> For chronic health conditions, consult your doctor 
                    or mental health professional for specific, effective practices
                  </div>
                </div>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Keep Yourself Accountable</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <div>
                    <strong>Monitor Results:</strong> Check in with yourself regularly. Still overwhelmed by stress? 
                    Exhausted or bored by your routine? Adjust as needed
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <div>
                    <strong>Be Patient:</strong> Don't punish yourself if you don't meet a goal. Ask "What stopped me?" 
                    If internal (loss of motivation), create rewards. If external (scheduling conflict), adjust your calendar
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <div>
                    <strong>Stay Flexible:</strong> Goals don't need to remain fixed forever. Life changes, and your 
                    self-care plan should adapt too
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <div>
                    <strong>Reschedule, Don't Cancel:</strong> If something unexpected comes up, move your self-care 
                    activity to a different day—but commit to showing up
                  </div>
                </div>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Adopt Relaxation Techniques</h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-3">Stress management is crucial for self-care. Try these relaxation practices:</p>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <div>
                    <strong>Deep Breathing:</strong> Slow, cleansing breaths activate your body's parasympathetic nervous 
                    system, countering the fight-or-flight stress response
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <div>
                    <strong>Progressive Muscle Relaxation:</strong> Gradually tense and relax different muscle groups 
                    to explore how tension feels and learn to release it
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <div>
                    <strong>Visualization:</strong> Use guided imagery to conjure soothing scenes—a favorite park, 
                    beach, or abstract visual like stress melting away
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <div>
                    <strong>Nature Walks:</strong> Walking outdoors, listening to comforting music, or daily meditation 
                    can provide simple, effective relaxation
                  </div>
                </div>
              </div>
            </div>

            {/* Tip 4 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">4. Learn to Manage Your Emotions</h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-3">
                  Building emotional intelligence (EQ) helps you identify emotions and understand why they arise, 
                  connecting emotional dips with the need for more self-care:
                </p>
                <div className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">→</span>
                  <div>
                    <strong>Self-Validate:</strong> Acknowledge your emotions and explore what's driving them. Don't 
                    write off feelings as passing moods—get curious about their causes
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">→</span>
                  <div>
                    <strong>Turn Emotion Into Action:</strong> Rather than suppress emotions, use them to compel action. 
                    Feeling low? Phone a friend, go for a walk, or journal
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">→</span>
                  <div>
                    <strong>Practice Self-Compassion:</strong> Be less self-critical. Talk to yourself like you'd talk 
                    to a friend. Accept that negative emotions like anger, sadness, and disgust are normal
                  </div>
                </div>
              </div>
            </div>

            {/* Tip 5 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">5. Build Your Social Network</h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-3">
                  Building social support can go hand-in-hand with other self-care goals. Friends can inspire you 
                  to stick with healthy habits and provide stress relief:
                </p>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <div>
                    <strong>Invite People In:</strong> Deepen existing connections by inviting coworkers or acquaintances 
                    for coffee, lunch, or to join you in self-care activities like meal prep or bike rides
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <div>
                    <strong>Join Aligned Groups:</strong> Join clubs that align with your self-care practices—swimming 
                    clubs, sports teams, religious organizations, or yoga groups
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <div>
                    <strong>Volunteer:</strong> Serving others cultivates belonging, purpose, and accomplishment while 
                    being part of something bigger than yourself
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-8 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Getting Started with Self-Care
            </h2>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Self-care is crucial for your physical, mental, and emotional well-being. If you're not used to 
                prioritizing your own needs, you may feel self-conscious or guilty about taking time for yourself.
              </p>
              <p className="mb-4">
                <strong>Start slowly if necessary.</strong> Gradually carve out moments for yourself and set your 
                sights on one goal at a time. Remember not to shame yourself—instead, congratulate yourself for taking 
                steps to improve your mental health.
              </p>
              <p className="mb-4">
                In time, some of these activities may turn into healthy habits that you do automatically, without much 
                thought, and benefit your life in many different ways.
              </p>
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-green-900 font-medium">
                  💚 Self-care isn't selfish—it's essential. By taking care of yourself, you're better equipped 
                  to care for others and handle life's challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Resources */}
        <section className="mb-12">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">If You're in Crisis</h2>
                <p className="text-gray-700 mb-4">
                  If you're experiencing a mental health crisis, help is available 24/7:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">988 - Suicide & Crisis Lifeline</p>
                      <p className="text-gray-700 text-sm">Call or text 988 for immediate support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">911 - Emergency Services</p>
                      <p className="text-gray-700 text-sm">For immediate danger or medical emergencies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Crisis Text Line</p>
                      <p className="text-gray-700 text-sm">Text "HELLO" to 741741</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-12">
          <div className="bg-blue-50 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Learn More About Self-Care</h2>
            <div className="space-y-3">
              <a 
                href="https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-blue-600 hover:text-blue-800">
                  NIMH: Caring for Your Mental Health →
                </p>
                <p className="text-sm text-gray-600">National Institute of Mental Health resources</p>
              </a>
              <a 
                href="https://www.helpguide.org/mental-health/wellbeing/building-better-mental-health"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-blue-600 hover:text-blue-800">
                  HelpGuide: Building Better Mental Health →
                </p>
                <p className="text-sm text-gray-600">Six strategies to boost mood and build resilience</p>
              </a>
              <Link 
                href="/navigator"
                className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-blue-600 hover:text-blue-800">
                  Find Mental Health Support →
                </p>
                <p className="text-sm text-gray-600">Connect with local providers and resources</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Data Source */}
        <div className="text-sm text-gray-500 border-t pt-6">
          <p>
            <strong>Information Source:</strong> This page provides educational information about self-care based on 
            resources from HelpGuide.org and the National Institute of Mental Health (NIMH). Self-care practices 
            should complement, not replace, professional mental health treatment when needed.
          </p>
          <p className="mt-2">
            <strong>References:</strong> Content adapted from "Self-Care Tips to Prioritize Your Mental Health" 
            (HelpGuide.org, 2024) and "Caring for Your Mental Health" (NIMH).
          </p>
        </div>
      </div>
    </div>
  );
}
